import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

/**
 * Projects arbitrary content and overlays a small count bubble at its
 * top-right corner.
 *
 * ```html
 * <ide-badge [count]="notifications" [showZero]="false" [offset]="[0, 0]">
 *   <ui-icon icon="bell"></ui-icon>
 * </ide-badge>
 * ```
 */
@Component({
  selector: 'ide-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  /** Value rendered inside the bubble. */
  readonly count = input<number>(0)

  /** Render the bubble even when the count is zero. */
  readonly showZero = input<boolean>(false)

  /** Pixel shift `[x, y]` from the default top-right anchor. */
  readonly offset = input<[number, number]>()

  /** Whether the bubble is shown for the current count and `showZero` value. */
  protected readonly visible = computed(() => {
    const count = this.count()
    return count > 0 || (count === 0 && this.showZero())
  })

  /** Right inset in pixels, or `null` to keep the default anchor. */
  protected readonly right = computed(() => {
    const offset = this.offset()
    return offset ? -offset[0] : null
  })

  /** Top margin in pixels, or `null` to keep the default anchor. */
  protected readonly top = computed(() => {
    const offset = this.offset()
    return offset ? offset[1] : null
  })
}
