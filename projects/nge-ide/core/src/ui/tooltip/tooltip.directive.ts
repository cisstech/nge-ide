import { FocusMonitor } from '@angular/cdk/a11y'
import { ConnectedPosition, FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { DestroyRef, Directive, ElementRef, NgZone, OnDestroy, Renderer2, effect, inject, input } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ThemeService } from '../../theme/theme.service'
import { TooltipComponent } from './tooltip.component'

let nextUniqueId = 0

/** Gap in pixels between the trigger and the tooltip bubble. */
const GAP = 6

/**
 * ng-zorro / ant-design placement names mapped to CDK connected positions.
 * Covers the plain sides plus the corner-aligned variants (e.g. `topRight`).
 */
const POSITIONS: Record<string, ConnectedPosition> = {
  top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -GAP },
  bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: GAP },
  left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -GAP },
  right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: GAP },
  topLeft: { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -GAP },
  topRight: { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -GAP },
  bottomLeft: { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: GAP },
  bottomRight: { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: GAP },
  leftTop: { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -GAP },
  leftBottom: { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetX: -GAP },
  rightTop: { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: GAP },
  rightBottom: { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: GAP },
}

/**
 * Attribute directive that shows a compact, VS-Code-like tooltip on hover and on
 * keyboard focus, built on `@angular/cdk/overlay`. Drop-in replacement for
 * ng-zorro's `nz-tooltip`.
 *
 * The directive value is the tooltip text (renamed from `nz-tooltip`); an empty
 * or whitespace-only value shows nothing. `ideTooltipPlacement` (renamed from
 * `nzTooltipPlacement`) accepts a single placement name (`top`, `bottomRight`,
 * ...) or an ordered list used as preferred positions.
 *
 * It hides on pointer leave, blur, `Escape` and on destroy, and wires
 * `aria-describedby` to the bubble while it is visible.
 *
 * @example
 * ```html
 * <span [ideTooltip]="label">…</span>
 * <span [ideTooltip]="label" [ideTooltipPlacement]="['top', 'bottom']">…</span>
 * <span ideTooltip="Read-only editor" ideTooltipPlacement="topRight">…</span>
 * ```
 */
@Directive({
  selector: '[ideTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    // Dismiss on click so a tooltip on a toggle button does not linger after the
    // button is activated (and its content re-renders).
    '(mousedown)': 'hide()',
  },
})
export class TooltipDirective implements OnDestroy {
  private readonly overlay = inject(Overlay)
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly renderer = inject(Renderer2)
  private readonly ngZone = inject(NgZone)
  private readonly focusMonitor = inject(FocusMonitor)
  private readonly destroyRef = inject(DestroyRef)
  private readonly themeService = inject(ThemeService)

  /** Tooltip text; an empty or whitespace-only value shows nothing (replaces `nz-tooltip`). */
  readonly text = input<string | null | undefined>('', { alias: 'ideTooltip' })

  /**
   * Preferred placement: a single name (`top`, `bottom`, `left`, `right`,
   * `topRight`, ...) or an ordered fallback list (replaces `nzTooltipPlacement`).
   */
  readonly placement = input<string | string[]>('top', { alias: 'ideTooltipPlacement' })

  private readonly tooltipId = `ide-tooltip-${nextUniqueId++}`

  private overlayRef: OverlayRef | null = null
  private positionStrategy: FlexibleConnectedPositionStrategy | null = null
  private portal: ComponentPortal<TooltipComponent> | null = null
  private instance: TooltipComponent | null = null
  private detachEscapeListener: (() => void) | null = null

  constructor() {
    // Show on keyboard/programmatic focus only, never after a mouse click.
    this.focusMonitor
      .monitor(this.elementRef)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((origin) => {
        this.ngZone.run(() => {
          if (!origin) {
            this.hide()
          } else if (origin === 'keyboard' || origin === 'program') {
            this.show()
          }
        })
      })

    // Keep an open bubble in sync with the bound text, hiding it if emptied.
    effect(() => {
      const message = this.message()
      if (!this.instance) {
        return
      }
      if (message) {
        this.instance.text.set(message)
      } else {
        this.hide()
      }
    })
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef)
    this.detachEscapeListener?.()
    this.overlayRef?.dispose()
    this.overlayRef = null
  }

  show(): void {
    const message = this.message()
    if (!message || this.overlayRef?.hasAttached()) {
      return
    }

    const overlayRef = this.getOverlayRef()
    this.positionStrategy?.withPositions(this.resolvePositions())
    this.portal ??= new ComponentPortal(TooltipComponent)

    const ref = overlayRef.attach(this.portal)
    this.instance = ref.instance
    this.instance.id.set(this.tooltipId)
    this.instance.text.set(message)
    ref.changeDetectorRef.detectChanges()

    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-describedby', this.tooltipId)
    this.detachEscapeListener = this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        this.hide()
      }
    })
  }

  hide(): void {
    this.detachEscapeListener?.()
    this.detachEscapeListener = null
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach()
    }
    this.instance = null
    this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-describedby')
  }

  private message(): string {
    return (this.text() ?? '').trim()
  }

  private getOverlayRef(): OverlayRef {
    if (this.overlayRef) {
      return this.overlayRef
    }

    this.positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(this.resolvePositions())
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withPush(false)

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      panelClass: ['ide-tooltip-panel', this.themeService.overlayClass()],
      disposeOnNavigation: true,
    })

    return this.overlayRef
  }

  private resolvePositions(): ConnectedPosition[] {
    const raw = this.placement()
    const names: string[] = Array.isArray(raw) ? raw : [raw]
    const pick = (list: readonly string[]): ConnectedPosition[] =>
      list.map((name) => POSITIONS[name]).filter((position): position is ConnectedPosition => !!position)

    const requested = pick(names)
    const positions = requested.length ? requested : pick(['top'])

    // Always append the four sides as fallbacks so the bubble stays on screen.
    for (const fallback of pick(['top', 'bottom', 'right', 'left'])) {
      if (!positions.includes(fallback)) {
        positions.push(fallback)
      }
    }

    return positions
  }
}
