import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import {
  DOCUMENT,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  ViewContainerRef,
  forwardRef,
  inject,
  signal,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Subscription } from 'rxjs'
import { IdeAutoOptionComponent } from './auto-option.component'
import { IdeAutocompleteComponent } from './autocomplete.component'

/** Id of the singleton `<style>` element holding the CDK overlay structural rules. */
const OVERLAY_STYLE_ELEMENT_ID = 'ide-autocomplete-overlay-styles'

/**
 * Minimal CDK overlay structural styles, injected once so the panel is
 * positioned correctly even when the consuming app does not import
 * `@angular/cdk/overlay-prebuilt.css` globally.
 */
const OVERLAY_STRUCTURAL_STYLES = `
.cdk-overlay-container {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.cdk-overlay-container:empty {
  display: none;
}
.cdk-overlay-connected-position-bounding-box {
  position: absolute;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  min-width: 1px;
  min-height: 1px;
}
.cdk-overlay-pane {
  position: absolute;
  z-index: 1000;
  display: flex;
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100%;
  pointer-events: auto;
}
`

/**
 * Trigger that binds a native `<input>` (or `<textarea>`) to an
 * `<ide-autocomplete>` panel, showing filtered options in a CDK overlay.
 *
 * Replaces ng-zorro's `[nzAutocomplete]`. It is the input's
 * {@link ControlValueAccessor}, so it stays compatible with `formControl`,
 * `formControlName` and `[(ngModel)]`: typing pushes the raw text to the model
 * (the consumer filters on it) and picking an option pushes the option's
 * `value`, mirroring ng-zorro's behaviour.
 *
 * Keyboard: ArrowUp/ArrowDown move the highlight (opening the panel if closed),
 * Enter selects the active option, Escape closes the panel. Navigation uses
 * `aria-activedescendant` so DOM focus never leaves the input.
 *
 * @example
 * ```html
 * <input [ideAutocomplete]="auto" [formControl]="query" />
 * <ide-autocomplete #auto (selectionChange)="onSelected($event.value)">...</ide-autocomplete>
 * ```
 */
@Directive({
  selector: 'input[ideAutocomplete], textarea[ideAutocomplete]',
  standalone: true,
  exportAs: 'ideAutocompleteTrigger',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdeAutocompleteDirective),
      multi: true,
    },
  ],
  host: {
    autocomplete: 'off',
    '[attr.role]': '"combobox"',
    '[attr.aria-autocomplete]': '"list"',
    '[attr.aria-expanded]': 'panelOpen() ? "true" : "false"',
    '[attr.aria-controls]': 'panelOpen() ? controlsId() : null',
    '[attr.aria-activedescendant]': 'activeOptionId()',
    '(focusin)': 'handleFocus()',
    '(input)': 'handleInput($event)',
    '(keydown)': 'handleKeydown($event)',
    '(blur)': 'handleBlur()',
  },
})
export class IdeAutocompleteDirective implements ControlValueAccessor, OnDestroy {
  private readonly overlay = inject(Overlay)
  private readonly viewContainerRef = inject(ViewContainerRef)
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef)
  private readonly document = inject(DOCUMENT)

  private overlayRef: OverlayRef | null = null
  private portal: TemplatePortal | null = null
  private panelSubscription: Subscription | null = null
  private previousValue: unknown = null

  /** Panel to open under the input (was `[nzAutocomplete]`). */
  @Input('ideAutocomplete') panel?: IdeAutocompleteComponent

  /** Whether the overlay is currently open. */
  protected readonly panelOpen = signal(false)

  /** Id of the active option, exposed through `aria-activedescendant`. */
  protected readonly activeOptionId = signal<string | null>(null)

  private onChange: (value: unknown) => void = () => {}
  private onTouched: () => void = () => {}

  constructor() {
    this.ensureOverlayStyles()
  }

  ngOnDestroy(): void {
    this.destroyPanel(false)
    this.overlayRef?.dispose()
    this.overlayRef = null
  }

  // ControlValueAccessor

  writeValue(value: unknown): void {
    // Defer so freshly projected options are queryable when resolving the label.
    Promise.resolve().then(() => {
      this.previousValue = value
      this.setInputDisplay(value)
    })
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.input.disabled = isDisabled
  }

  // Host handlers

  protected controlsId(): string | null {
    return this.panel?.id ?? null
  }

  protected handleFocus(): void {
    if (!this.input.readOnly) {
      this.openPanel()
    }
  }

  protected handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    if (this.previousValue !== value) {
      this.previousValue = value
      this.onChange(value)
    }
    this.openPanel()
    this.setActiveOption(-1)
  }

  protected handleKeydown(event: Event): void {
    const keyEvent = event as KeyboardEvent
    const key = keyEvent.key
    const manager = this.panel?.keyManager

    if (key === 'Escape' && this.panelOpen()) {
      keyEvent.preventDefault()
      keyEvent.stopPropagation()
      this.destroyPanel(true)
      return
    }

    if (key === 'Enter') {
      const active = manager?.activeItem
      if (this.panelOpen() && active) {
        keyEvent.preventDefault()
        active.selectViaInteraction()
      }
      return
    }

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      keyEvent.preventDefault()
      if (this.panelOpen()) {
        manager?.onKeydown(keyEvent)
      } else {
        this.openPanel()
      }
    }
  }

  protected handleBlur(): void {
    // Closing is driven by Escape, Tab-out, outside pointer events and selection
    // so a click on the panel (scrollbar, padding) does not dismiss it.
    this.onTouched()
  }

  // Panel management

  private openPanel(): void {
    const panel = this.panel
    if (!panel) {
      return
    }

    const overlayRef = this.getOrCreateOverlay()
    if (!overlayRef.hasAttached()) {
      this.portal ??= new TemplatePortal(panel.template, this.viewContainerRef)
      overlayRef.attach(this.portal)
      this.subscribeToPanel(overlayRef, panel)
    }

    overlayRef.updateSize({ width: this.input.getBoundingClientRect().width })
    overlayRef.updatePosition()
    this.setActiveOption(-1)
    this.panelOpen.set(true)
  }

  private subscribeToPanel(overlayRef: OverlayRef, panel: IdeAutocompleteComponent): void {
    const subscription = new Subscription()
    this.panelSubscription = subscription

    subscription.add(
      panel.optionSelectionChanges.subscribe((event) => {
        if (event.isUserInput) {
          this.selectOption(event.source)
        }
      })
    )
    subscription.add(panel.options.changes.subscribe(() => overlayRef.updatePosition()))
    subscription.add(
      overlayRef.outsidePointerEvents().subscribe((event) => {
        const target = event.target as Node | null
        if (target && target !== this.input && !this.input.contains(target)) {
          this.destroyPanel(true)
        }
      })
    )

    const wireKeyManager = (): void => {
      const manager = panel.keyManager
      if (!manager || this.panelSubscription !== subscription) {
        return
      }
      subscription.add(manager.change.subscribe(() => this.onActiveOptionChange()))
      subscription.add(manager.tabOut.subscribe(() => this.destroyPanel(true)))
    }

    // The panel builds its key manager in ngAfterContentInit, which can land just
    // after this first open when focus is auto-captured during initialization.
    if (panel.keyManager) {
      wireKeyManager()
    } else {
      Promise.resolve().then(wireKeyManager)
    }
  }

  private onActiveOptionChange(): void {
    const active = this.panel?.keyManager?.activeItem ?? null
    this.activeOptionId.set(active?.id ?? null)
    if (active) {
      active.scrollIntoViewIfNeeded()
      if (this.panel?.backfill) {
        this.input.value = active.getLabel()
      }
    }
  }

  private selectOption(option: IdeAutoOptionComponent): void {
    const value = option.value
    this.input.value = option.getLabel()
    this.previousValue = value
    this.onChange(value)
    this.onTouched()
    this.panel?.emitSelectionChange(option)
    this.destroyPanel(false)
  }

  private destroyPanel(restoreDisplay: boolean): void {
    this.panelSubscription?.unsubscribe()
    this.panelSubscription = null
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach()
    }
    this.setActiveOption(-1)
    this.panelOpen.set(false)
    if (restoreDisplay) {
      this.setInputDisplay(this.previousValue)
    }
  }

  private setActiveOption(index: number): void {
    this.panel?.keyManager?.setActiveItem(index)
    if (index < 0) {
      this.activeOptionId.set(null)
    }
  }

  private setInputDisplay(value: unknown): void {
    const option = this.findOption(value)
    this.input.value = option ? option.getLabel() : this.coerceDisplay(value)
  }

  private findOption(value: unknown): IdeAutoOptionComponent | null {
    const options = this.panel?.options
    if (!options) {
      return null
    }
    return options.find((option) => option.value === value) ?? null
  }

  private coerceDisplay(value: unknown): string {
    if (value == null) {
      return ''
    }
    return typeof value === 'string' ? value : String(value)
  }

  private getOrCreateOverlay(): OverlayRef {
    if (this.overlayRef) {
      return this.overlayRef
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 2 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -2 },
      ])

    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        width: this.input.getBoundingClientRect().width,
        panelClass: 'ide-autocomplete-overlay',
      })
    )

    return this.overlayRef
  }

  /** The native input (or textarea) the trigger is attached to. */
  private get input(): HTMLInputElement {
    return this.elementRef.nativeElement
  }

  private ensureOverlayStyles(): void {
    if (this.document.getElementById(OVERLAY_STYLE_ELEMENT_ID)) {
      return
    }
    const style = this.document.createElement('style')
    style.id = OVERLAY_STYLE_ELEMENT_ID
    style.textContent = OVERLAY_STRUCTURAL_STYLES
    this.document.head.appendChild(style)
  }
}
