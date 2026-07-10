import { Type } from '@angular/core'

/** Visual style of an {@link IdeModalButton} (replaces ng-zorro's button `nzType`). */
export type IdeModalButtonType = 'primary' | 'default'

/**
 * Declarative footer button of a modal, mirroring the plain objects the IDE
 * passes to ng-zorro's `nzFooter`. Every `nz`-prefixed field is renamed to its
 * plain form: `label`, an optional `type`/`danger` for styling, `disabled`, and
 * an `onClick` handler.
 */
export interface IdeModalButton<C = unknown> {
  /** Text rendered inside the button. */
  label: string
  /** Visual style; `'primary'` renders the accent button. Replaces the button's `type`. */
  type?: IdeModalButtonType
  /** Renders the destructive (danger) styling. Replaces ng-zorro's `danger`. */
  danger?: boolean
  /** Whether the button is disabled and non-interactive. */
  disabled?: boolean
  /**
   * Invoked when the button is activated. Clicking never dismisses the modal on
   * its own (matching ng-zorro): call {@link IdeModalRef.close} from the handler
   * to close it. Receives the content component instance when the modal hosts a
   * component.
   */
  onClick?: (contentComponentInstance?: C) => void
}

/**
 * Options accepted by `IdeModalService.create`/`open`. Each field is the plain
 * rename of the matching `nz`-prefixed `NzModalService.create` option the IDE
 * relies on (`nzTitle` -> `title`, `nzContent` -> `content`, `nzFooter` ->
 * `footer`, `nzMaskClosable` -> `maskClosable`, and so on).
 */
export interface IdeModalOptions<C = unknown> {
  /** Header title text. Replaces `nzTitle`. */
  title?: string
  /**
   * Body content: either a string (rendered as sanitized HTML) or a component
   * type instantiated inside the body. Replaces `nzContent`.
   */
  content?: string | Type<C>
  /**
   * Inputs assigned to the content component when {@link content} is a component
   * type. Replaces `nzComponentParams`.
   */
  componentParams?: Record<string, unknown>
  /** Whether the header shows a close (×) button. Replaces `nzClosable`. Defaults to `true`. */
  closable?: boolean
  /** Whether clicking the backdrop closes the modal. Replaces `nzMaskClosable`. Defaults to `true`. */
  maskClosable?: boolean
  /** Whether pressing `Escape` closes the modal. Replaces `nzKeyboard`. Defaults to `true`. */
  keyboard?: boolean
  /** Whether a dimmed backdrop is rendered behind the modal. Replaces `nzMask`. Defaults to `true`. */
  mask?: boolean
  /** Vertically centers the modal. Replaces `nzCentered`. Defaults to `true`. */
  centered?: boolean
  /** Kept for parity with `nzModalType`; `'confirm'` exposes the `alertdialog` ARIA role. */
  modalType?: 'default' | 'confirm'
  /** Inline styles applied to the body wrapper. Replaces `nzBodyStyle`. */
  bodyStyle?: Record<string, string>
  /** Footer buttons, or `null` to hide the footer entirely. Replaces `nzFooter`. */
  footer?: IdeModalButton<C>[] | null
  /** Width of the modal; a number is treated as pixels. Replaces `nzWidth`. */
  width?: string | number
}

/**
 * Normalized data handed to `IdeModalContainerComponent` through `DIALOG_DATA`.
 * `IdeModalService` resolves every default before opening the dialog so the
 * container stays purely presentational.
 *
 * @internal
 */
export interface IdeModalContainerData<C = unknown> {
  title?: string
  /** DOM id set on the title element and referenced by the dialog's `aria-labelledby`. */
  titleId: string
  content?: string | Type<C>
  componentParams?: Record<string, unknown>
  closable: boolean
  bodyStyle?: Record<string, string>
  footer: IdeModalButton<C>[]
}
