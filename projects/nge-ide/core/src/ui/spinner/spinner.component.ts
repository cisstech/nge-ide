import { ChangeDetectionStrategy, Component, input } from '@angular/core'

/** Diameter preset for {@link SpinnerComponent}. */
export type IdeSpinnerSize = 'small' | 'default' | 'large'

/**
 * Indeterminate loading spinner. Standalone, pure-CSS replacement for
 * `nz-spin` when it is used purely as a busy indicator.
 *
 * The rotation lives on an inner ring rather than on the host, so a
 * `transform` applied to the host by a consumer (for instance the `.center`
 * helper that overlays the spinner on the editor) is never clobbered by the
 * animation.
 */
@Component({
  selector: 'ide-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ide-spinner',
    role: 'progressbar',
    'aria-label': 'Loading',
    'aria-busy': 'true',
    '[class.ide-spinner--small]': "size() === 'small'",
    '[class.ide-spinner--large]': "size() === 'large'",
  },
})
export class SpinnerComponent {
  /** Diameter of the spinner (replaces ng-zorro's `nzSize`). */
  readonly size = input<IdeSpinnerSize>('default')
}
