import { Dialog } from '@angular/cdk/dialog'
import { hasModifierKey } from '@angular/cdk/keycodes'
import { Overlay } from '@angular/cdk/overlay'
import { DOCUMENT, Injectable, inject } from '@angular/core'
import { takeUntil } from 'rxjs'
import { ThemeService } from '../../theme/theme.service'
import { IdeModalContainerComponent } from './ide-modal.component'
import { IdeModalRef } from './ide-modal-ref'
import { IdeModalContainerData, IdeModalOptions } from './ide-modal.types'

/** Id of the singleton `<style>` element that carries the overlay CSS. */
const STYLE_ELEMENT_ID = 'ide-modal-overlay-styles'

/** Per-document counter used to mint unique title ids for `aria-labelledby`. */
let nextUniqueId = 0

/**
 * The structural styles the CDK overlay needs to position itself, plus the
 * IDE-specific backdrop/panel appearance. They are injected once from this
 * service (mirroring the shared stylesheet pattern used by `[ideButton]`) so a
 * modal renders correctly without the consumer importing a global stylesheet,
 * even after ng-zorro (which used to bring these rules in) is removed. Every
 * rule is a verbatim copy of `@angular/cdk/overlay-prebuilt.css`, so it is a
 * harmless no-op when those styles are already present.
 */
const OVERLAY_STYLES = `
.cdk-overlay-container, .cdk-global-overlay-wrapper {
  pointer-events: none;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
.cdk-overlay-container {
  position: fixed;
  z-index: 1000;
}
.cdk-overlay-container:empty {
  display: none;
}
.cdk-global-overlay-wrapper {
  display: flex;
  position: absolute;
  z-index: 1000;
}
.cdk-overlay-pane {
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  display: flex;
  max-width: 100%;
  max-height: 100%;
  z-index: 1000;
}
.cdk-overlay-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  opacity: 0;
  touch-action: manipulation;
  z-index: 1000;
  transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
@media (prefers-reduced-motion) {
  .cdk-overlay-backdrop {
    transition-duration: 1ms;
  }
}
.cdk-overlay-backdrop-showing {
  opacity: 1;
}
@media (forced-colors: active) {
  .cdk-overlay-backdrop-showing {
    opacity: 0.6;
  }
}
.cdk-overlay-transparent-backdrop {
  transition: visibility 1ms linear, opacity 1ms linear;
  visibility: hidden;
  opacity: 1;
}
.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing,
.cdk-high-contrast-active .cdk-overlay-transparent-backdrop {
  opacity: 0;
  visibility: visible;
}
.cdk-overlay-backdrop-noop-animation {
  transition: none;
}
.cdk-global-scrollblock {
  position: fixed;
  width: 100%;
  overflow-y: scroll;
}
.cdk-overlay-popover {
  background: none;
  border: none;
  padding: 0;
  outline: 0;
  overflow: visible;
  position: fixed;
  pointer-events: none;
  white-space: normal;
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  inset: auto;
  top: 0;
  left: 0;
}
.cdk-overlay-popover::backdrop {
  display: none;
}
.cdk-overlay-popover .cdk-overlay-backdrop {
  position: fixed;
  z-index: auto;
}

/* IDE modal appearance */
.ide-modal-backdrop {
  background: var(--modal-backdrop, rgba(0, 0, 0, 0.5));
}
.ide-modal-panel {
  margin: 16px;
}
`

/**
 * Injectable, VS-Code-like modal service built on `@angular/cdk/dialog`. It is a
 * drop-in replacement for ng-zorro's `NzModalService` for the surface the IDE
 * relies on: `create`/`open` take plain (un-prefixed) options and return an
 * {@link IdeModalRef} exposing `afterClose` and `close(result)`.
 *
 * Body content may be a string (rendered as sanitized HTML) or a component type
 * with `componentParams`, matching `nzContent` + `nzComponentParams`.
 *
 * @example
 * ```ts
 * const ref = modal.create<unknown, boolean>({
 *   title: 'Delete file',
 *   content: 'This cannot be undone.',
 *   footer: [
 *     { label: 'Cancel', onClick: () => ref.close(false) },
 *     { label: 'Delete', type: 'primary', danger: true, onClick: () => ref.close(true) },
 *   ],
 * })
 * ref.afterClose.subscribe((confirmed) => { ... })
 * ```
 */
@Injectable({ providedIn: 'root' })
export class IdeModalService {
  private readonly dialog = inject(Dialog)
  private readonly overlay = inject(Overlay)
  private readonly document = inject(DOCUMENT)
  private readonly themeService = inject(ThemeService)

  constructor() {
    this.ensureStylesInjected()
  }

  /**
   * Opens a modal and returns a handle to it.
   *
   * @typeParam C Type of the content component when {@link IdeModalOptions.content} is a component.
   * @typeParam R Type of the result emitted by {@link IdeModalRef.afterClose}.
   */
  create<C = unknown, R = unknown>(options: IdeModalOptions<C>): IdeModalRef<R> {
    const titleId = `ide-modal-title-${nextUniqueId++}`
    const closable = options.closable ?? true
    const maskClosable = options.maskClosable ?? true
    const keyboard = options.keyboard ?? true
    const mask = options.mask ?? true
    const centered = options.centered ?? true

    const data: IdeModalContainerData<C> = {
      title: options.title,
      titleId,
      content: options.content,
      componentParams: options.componentParams,
      closable,
      bodyStyle: options.bodyStyle,
      footer: Array.isArray(options.footer) ? options.footer : [],
    }

    const width = typeof options.width === 'number' ? `${options.width}px` : (options.width ?? '480px')

    const dialogRef = this.dialog.open<R, IdeModalContainerData<C>>(IdeModalContainerComponent, {
      data,
      width,
      maxWidth: '90vw',
      hasBackdrop: mask,
      backdropClass: ['ide-modal-backdrop', this.themeService.overlayClass()],
      panelClass: ['ide-modal-panel', this.themeService.overlayClass()],
      // Close on ESC/backdrop is driven manually below so `keyboard` and
      // `maskClosable` can be honored independently of each other.
      disableClose: true,
      role: options.modalType === 'confirm' ? 'alertdialog' : 'dialog',
      ariaModal: true,
      ariaLabelledBy: options.title ? titleId : null,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      positionStrategy: centered ? undefined : this.overlay.position().global().centerHorizontally().top('12vh'),
    })

    if (keyboard) {
      dialogRef.keydownEvents.pipe(takeUntil(dialogRef.closed)).subscribe((event) => {
        if (event.key === 'Escape' && !hasModifierKey(event)) {
          event.preventDefault()
          dialogRef.close()
        }
      })
    }

    if (mask && maskClosable) {
      dialogRef.backdropClick.pipe(takeUntil(dialogRef.closed)).subscribe(() => {
        dialogRef.close()
      })
    }

    return new IdeModalRef<R>(dialogRef)
  }

  /** Alias of {@link create}, matching ng-zorro's naming for opening a modal. */
  open<C = unknown, R = unknown>(options: IdeModalOptions<C>): IdeModalRef<R> {
    return this.create<C, R>(options)
  }

  /** Adds the shared overlay stylesheet to `<head>` exactly once per document. */
  private ensureStylesInjected(): void {
    const doc = this.document
    if (doc.getElementById(STYLE_ELEMENT_ID)) {
      return
    }

    const style = doc.createElement('style')
    style.id = STYLE_ELEMENT_ID
    style.textContent = OVERLAY_STYLES
    doc.head.appendChild(style)
  }
}
