import { DialogRef } from '@angular/cdk/dialog'
import { Observable } from 'rxjs'

/**
 * Handle to a modal opened through `IdeModalService`. Wraps the CDK `DialogRef`
 * and exposes the small surface the IDE relies on from an `NzModalRef`: an
 * `afterClose` stream and a `close(result?)` method.
 */
export class IdeModalRef<R = unknown> {
  /**
   * Emits the result once, right after the modal has closed. Replaces
   * `NzModalRef.afterClose`.
   */
  readonly afterClose: Observable<R | undefined>

  constructor(private readonly dialogRef: DialogRef<R>) {
    this.afterClose = this.dialogRef.closed
  }

  /** Unique id of the underlying dialog overlay. */
  get id(): string {
    return this.dialogRef.id
  }

  /**
   * Closes the modal, optionally passing a `result` that is emitted by
   * {@link afterClose}. Replaces `NzModalRef.close`/`destroy`.
   */
  close(result?: R): void {
    this.dialogRef.close(result)
  }
}
