import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog'
import { NgComponentOutlet, NgStyle } from '@angular/common'
import { ChangeDetectionStrategy, Component, Type, inject } from '@angular/core'
import { IdeModalButton, IdeModalContainerData } from './ide-modal.types'

/**
 * Presentational container rendered inside the CDK dialog overlay. It lays out
 * the modal chrome (header/title, body, footer) the way `nz-modal` does and
 * leaves opening, ESC/backdrop dismissal and result plumbing to
 * `IdeModalService`.
 *
 * The body renders either a sanitized HTML string or an arbitrary component
 * (with its inputs populated from `componentParams`), mirroring ng-zorro's
 * `nzContent` + `nzComponentParams`.
 *
 * It is instantiated by the CDK `Dialog` service, so it receives its data
 * through `DIALOG_DATA` and closes itself through the injected `DialogRef`
 * rather than through component inputs.
 */
@Component({
  selector: 'ide-modal',
  standalone: true,
  imports: [NgComponentOutlet, NgStyle],
  templateUrl: './ide-modal.component.html',
  styleUrls: ['./ide-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ide-modal',
  },
})
export class IdeModalContainerComponent<C = unknown> {
  private readonly dialogRef = inject(DialogRef)

  /** Normalized options provided by `IdeModalService`. */
  protected readonly data = inject<IdeModalContainerData<C>>(DIALOG_DATA)

  /** HTML string to project into the body, or `null` when the content is a component/empty. */
  protected readonly stringContent: string | null =
    typeof this.data.content === 'string' ? this.data.content : null

  /** Component type to instantiate in the body, or `null` when the content is a string/empty. */
  protected readonly componentContent: Type<C> | null =
    typeof this.data.content === 'function' ? (this.data.content as Type<C>) : null

  /** Whether the header (title and/or close button) should be rendered. */
  protected readonly showHeader = !!this.data.title || this.data.closable

  /** Closes the modal in response to the header close (×) button. */
  protected onCloseClick(): void {
    this.dialogRef.close()
  }

  /**
   * Runs a footer button's handler. Dismissal is intentionally left to the
   * handler (matching ng-zorro's `nzFooter` behaviour), which typically calls
   * `IdeModalRef.close` with a result.
   */
  protected onFooterClick(button: IdeModalButton<C>): void {
    if (button.disabled) {
      return
    }
    button.onClick?.()
  }
}
