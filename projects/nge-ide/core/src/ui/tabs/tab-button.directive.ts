import { type FocusableOption } from '@angular/cdk/a11y'
import { Directive, ElementRef, inject } from '@angular/core'

/**
 * Internal directive applied to every tab header rendered by
 * {@link TabsComponent}.
 *
 * It exposes each header as a CDK {@link FocusableOption} so a `FocusKeyManager`
 * can drive roving-tabindex keyboard navigation across the `tablist`. It is an
 * implementation detail of the tabs component and is not part of the public API.
 */
@Directive({
  selector: '[ideTabButton]',
  standalone: true,
})
export class TabButtonDirective implements FocusableOption {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)

  /** Moves DOM focus to this tab header (called by the `FocusKeyManager`). */
  focus(): void {
    this.host.nativeElement.focus()
  }
}
