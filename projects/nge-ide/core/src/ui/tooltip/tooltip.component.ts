import { ChangeDetectionStrategy, Component, signal } from '@angular/core'

/**
 * The floating bubble rendered by {@link TooltipDirective}.
 *
 * It is never placed in a template directly; the directive attaches it into a
 * CDK overlay as a `ComponentPortal`. The host carries `role="tooltip"` and a
 * unique `id` so the trigger element can point at it through `aria-describedby`.
 */
@Component({
  selector: 'ide-tooltip',
  standalone: true,
  template: '{{ text() }}',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ide-tooltip',
    role: 'tooltip',
    '[id]': 'id()',
  },
})
export class TooltipComponent {
  /** Text shown inside the bubble. */
  readonly text = signal('')

  /** DOM id referenced by the trigger's `aria-describedby`. */
  readonly id = signal('')
}
