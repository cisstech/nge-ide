import { CdkListbox, CdkOption } from '@angular/cdk/listbox'
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay'
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  contentChildren,
  forwardRef,
  inject,
  signal,
  viewChild,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { ThemeService } from '../../theme/theme.service'
import { OptionComponent } from './option.component'

/** Minimal shape of the event emitted by `cdkListbox` (its type is not exported by the CDK). */
interface ListboxValueChange {
  readonly value: readonly unknown[]
}

let nextUniqueId = 0

/**
 * A compact, VS-Code-like single-select dropdown.
 *
 * Replaces ng-zorro's `nz-select` / `nz-option` pairing. The trigger is a native
 * `<button>` that opens a `@angular/cdk/overlay` panel hosting a
 * `@angular/cdk/listbox`, which provides the roving-focus keyboard model
 * (arrows, `Home`/`End`, type-ahead, `Enter`/`Space` to commit). It implements
 * {@link ControlValueAccessor}, so it works with `[(ngModel)]`, `[ngModel]` +
 * `(ngModelChange)`, and reactive forms.
 *
 * Options are declared as projected {@link OptionComponent} (`ide-option`)
 * children; this component reads their `value` / `label` through a content query
 * and renders the interactive rows itself inside the overlay.
 *
 * @example
 * ```html
 * <ide-select [(ngModel)]="selected">
 *   <ide-option [value]="view.id" [label]="view.title"></ide-option>
 * </ide-select>
 * ```
 */
@Component({
  selector: 'ide-select',
  standalone: true,
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, CdkListbox, CdkOption],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  private readonly injector = inject(Injector)
  private readonly document = inject(DOCUMENT)

  /** IDE theme class stamped on the overlay panel so it renders under the right theme. */
  protected readonly overlayPanelClass = inject(ThemeService).overlayClass

  private readonly uid = nextUniqueId++

  /** Id of the trigger, used to label the listbox for assistive technology. */
  protected readonly triggerId = `ide-select-trigger-${this.uid}`

  /** Id of the listbox panel, used to focus it once the overlay is attached. */
  protected readonly listboxId = `ide-select-listbox-${this.uid}`

  private readonly triggerRef = viewChild.required<ElementRef<HTMLButtonElement>>('triggerButton')

  /**
   * Options declared as projected `ide-option` content. `descendants` is enabled
   * so options wrapped in `@for` / `@if` blocks are still collected.
   */
  protected readonly options = contentChildren(OptionComponent, { descendants: true })

  /** Whether the dropdown overlay is open. */
  protected readonly isOpen = signal(false)

  /** Whether the control is disabled (driven by reactive forms / `setDisabledState`). */
  protected readonly isDisabled = signal(false)

  /** Width applied to the overlay panel so it lines up with the trigger. */
  protected readonly panelWidth = signal(0)

  /** Currently selected value; the single source of truth for the view and the model. */
  private readonly selected = signal<unknown>(null)

  /** Selection expressed as the single-element array shape `cdkListbox` expects. */
  protected readonly selectedValues = computed<readonly unknown[]>(() => {
    const value = this.selected()
    return value === null || value === undefined ? [] : [value]
  })

  /** Label shown in the trigger for the current selection. */
  protected readonly selectedLabel = computed<string>(() => {
    const value = this.selected()
    if (value === null || value === undefined) {
      return ''
    }
    const match = this.options().find((option) => Object.is(option.value(), value))
    return match ? match.displayLabel() : ''
  })

  /** Preferred dropdown positions: below the trigger, flipping above when cramped. */
  protected readonly overlayPositions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ]

  private onChange: (value: unknown) => void = () => {}
  private onTouched: () => void = () => {}

  // ControlValueAccessor

  writeValue(value: unknown): void {
    this.selected.set(value ?? null)
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled)
    if (isDisabled) {
      this.close()
    }
  }

  // Trigger interaction

  protected toggle(): void {
    if (this.isDisabled()) {
      return
    }
    if (this.isOpen()) {
      this.closeAndFocusTrigger()
    } else {
      this.open()
    }
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (this.isDisabled() || this.isOpen()) {
      return
    }
    // Enter / Space open via the button's native click; arrows open explicitly.
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      this.open()
    }
  }

  protected open(): void {
    if (this.isDisabled() || this.isOpen()) {
      return
    }
    this.panelWidth.set(this.triggerRef().nativeElement.getBoundingClientRect().width)
    this.isOpen.set(true)
  }

  protected close(): void {
    if (!this.isOpen()) {
      return
    }
    this.isOpen.set(false)
    this.onTouched()
  }

  protected closeAndFocusTrigger(): void {
    if (!this.isOpen()) {
      return
    }
    this.close()
    this.triggerRef().nativeElement.focus()
  }

  // Overlay + listbox interaction

  protected onOverlayAttached(): void {
    // Once the listbox view has rendered, move focus into it so cdkListbox takes
    // over keyboard navigation; focusing the host routes focus to the currently
    // selected option (or the first one).
    afterNextRender(
      () => {
        this.document.getElementById(this.listboxId)?.focus()
      },
      { injector: this.injector },
    )
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault()
      this.closeAndFocusTrigger()
    } else if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      // cdkListbox commits the selection synchronously; close right after it does.
      queueMicrotask(() => this.closeAndFocusTrigger())
    }
  }

  protected onOutsideClick(): void {
    this.close()
  }

  protected onSelectionChange(event: ListboxValueChange): void {
    const next = event.value.length ? event.value[0] : null
    this.selected.set(next)
    this.onChange(next)
  }
}
