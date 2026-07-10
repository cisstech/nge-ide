import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core'

/**
 * Lightweight loading placeholder rendering a few content lines with an
 * optional shimmer. Drop-in replacement for `nz-skeleton`.
 *
 * The host is marked `aria-hidden` because the placeholder is purely
 * decorative: loading state is meant to be announced once by the surrounding
 * view rather than repeated by every skeleton instance on screen.
 */
@Component({
  selector: 'ide-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ide-skeleton',
    'aria-hidden': 'true',
    '[class.ide-skeleton--active]': 'active()',
  },
})
export class SkeletonComponent {
  /** Enables the shimmer animation (replaces ng-zorro's `nzActive`). */
  readonly active = input(false, { transform: booleanAttribute })
}
