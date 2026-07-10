import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core'

/**
 * A thin rule that separates content, laid out horizontally (default) or
 * vertically. Pure CSS, drop-in replacement for ng-zorro's `nz-divider`.
 *
 * ng-zorro inputs are renamed to plain names: `nzDashed` becomes `dashed`, and
 * the `nzType="vertical"` variant becomes the boolean `vertical`.
 *
 * The host carries `role="separator"` with a matching `aria-orientation` so it
 * is announced correctly, including when used between items of a menu.
 *
 * @example
 * ```html
 * <ide-divider dashed></ide-divider>
 * <span>a</span><ide-divider vertical></ide-divider><span>b</span>
 * ```
 */
@Component({
  selector: 'ide-divider',
  standalone: true,
  template: '',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ide-divider',
    role: 'separator',
    '[class.ide-divider--vertical]': 'vertical()',
    '[class.ide-divider--dashed]': 'dashed()',
    '[attr.aria-orientation]': 'vertical() ? "vertical" : "horizontal"',
  },
})
export class DividerComponent {
  /** Draws the line with a dashed stroke instead of solid (replaces `nzDashed`). */
  readonly dashed = input(false, { transform: booleanAttribute })

  /** Orients the divider vertically for inline use (replaces `nzType="vertical"`). */
  readonly vertical = input(false, { transform: booleanAttribute })
}
