import { DOCUMENT, Directive, inject, input } from '@angular/core'

/** Visual style of an `[ideButton]` (replaces ng-zorro's `nzType`). */
export type IdeButtonType = 'primary' | 'default' | 'text' | 'link' | 'dashed'

/** Height/padding scale of an `[ideButton]` (replaces ng-zorro's `nzSize`). */
export type IdeButtonSize = 'small' | 'default' | 'large'

/** Id of the singleton `<style>` element shared by every `[ideButton]`. */
const STYLE_ELEMENT_ID = 'ide-button-styles'

/**
 * Pure-CSS, VS-Code-like look for `[ideButton]` controls.
 *
 * Every color resolves from an IDE theme variable with a dark-friendly fallback,
 * and the focus ring is driven entirely by `:focus-visible` (no JavaScript focus
 * tracking). The rules are global on purpose so a single injected stylesheet
 * styles every button/anchor that carries the attribute, mirroring how
 * `nz-button` relies on a shared stylesheet. Nothing here uses `!important`, so
 * inline `[style]` bindings (e.g. per-action toolbar colors) keep winning.
 */
const BUTTON_STYLES = `
.ide-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-sizing: border-box;
  height: 26px;
  margin: 0;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 2px;
  background: transparent;
  color: var(--foreground, #cccccc);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.4;
  white-space: nowrap;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  transition: background-color 0.1s ease-in-out, border-color 0.1s ease-in-out,
    color 0.1s ease-in-out, filter 0.1s ease-in-out, opacity 0.1s ease-in-out;
}

.ide-btn:focus-visible {
  outline: 1px solid var(--focus-border, #0a84ff);
  outline-offset: 1px;
}

.ide-btn:disabled,
.ide-btn[disabled],
.ide-btn[aria-disabled='true'] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* default */
.ide-btn.ide-btn--default {
  background: var(--button-secondary-background, var(--input-background, #2b2b2b));
  border-color: var(--button-border, var(--tab-border, #3c3c3c));
  color: var(--button-secondary-foreground, var(--foreground, #cccccc));
}
.ide-btn.ide-btn--default:hover:not(:disabled):not([aria-disabled='true']) {
  border-color: var(--focus-border, #0a84ff);
}
.ide-btn.ide-btn--default:active:not(:disabled):not([aria-disabled='true']) {
  filter: brightness(1.15);
}

/* primary */
.ide-btn.ide-btn--primary {
  background: var(--button-background, var(--focus-border, #0a84ff));
  border-color: transparent;
  color: var(--button-foreground, #ffffff);
}
.ide-btn.ide-btn--primary:hover:not(:disabled):not([aria-disabled='true']) {
  background: var(--button-hover-background, var(--button-background, var(--focus-border, #0a84ff)));
  filter: brightness(1.08);
}
.ide-btn.ide-btn--primary:active:not(:disabled):not([aria-disabled='true']) {
  filter: brightness(0.92);
}

/* dashed */
.ide-btn.ide-btn--dashed {
  background: transparent;
  border: 1px dashed var(--button-border, var(--tab-border, #3c3c3c));
  color: var(--foreground, #cccccc);
}
.ide-btn.ide-btn--dashed:hover:not(:disabled):not([aria-disabled='true']) {
  border-color: var(--focus-border, #0a84ff);
  color: var(--focus-border, #0a84ff);
}

/* text */
.ide-btn.ide-btn--text {
  background: transparent;
  border-color: transparent;
  color: var(--foreground, #cccccc);
}
.ide-btn.ide-btn--text:hover:not(:disabled):not([aria-disabled='true']) {
  background: var(--toolbar-hover-background, rgba(255, 255, 255, 0.08));
}
.ide-btn.ide-btn--text:active:not(:disabled):not([aria-disabled='true']) {
  background: var(--toolbar-hover-background, rgba(255, 255, 255, 0.12));
}

/* link */
.ide-btn.ide-btn--link {
  height: auto;
  padding: 0 4px;
  background: transparent;
  border-color: transparent;
  color: var(--link-foreground, var(--focus-border, #0a84ff));
}
.ide-btn.ide-btn--link:hover:not(:disabled):not([aria-disabled='true']) {
  color: var(--link-active-foreground, var(--link-foreground, var(--focus-border, #0a84ff)));
  text-decoration: underline;
}

/* sizes */
.ide-btn.ide-btn--sm {
  height: 22px;
  padding: 0 7px;
  font-size: 12px;
}
.ide-btn.ide-btn--lg {
  height: 30px;
  padding: 0 14px;
  font-size: 14px;
}
.ide-btn.ide-btn--link.ide-btn--sm,
.ide-btn.ide-btn--link.ide-btn--lg {
  height: auto;
  padding: 0 4px;
}
`

/**
 * Styling primitive that replaces ng-zorro's `nz-button`.
 *
 * Applied as an attribute on native `<button>` and `<a>` elements, it gives them
 * the compact, dark-friendly look of the IDE toolbar while leaving click, focus
 * and navigation behaviour to the native element. Existing content (icons,
 * labels, SVG) is untouched because the directive only decorates the host, and
 * ng-zorro's `nz`-prefixed inputs are renamed to plain names (`nzType` ->
 * `type`, `nzSize` -> `size`).
 *
 * The look is delivered as a single stylesheet injected into the document head
 * the first time any `[ideButton]` is created, so consumers do not need to
 * import a global stylesheet.
 *
 * @example
 * ```html
 * <button ideButton [type]="'primary'" (click)="save()">
 *   <ui-icon icon="save" /> Save
 * </button>
 * <button ideButton [type]="'text'" [size]="'small'">File</button>
 * <a ideButton [type]="'link'" href="https://example.com">Docs</a>
 * ```
 */
@Directive({
  selector: 'button[ideButton], a[ideButton]',
  standalone: true,
  host: {
    class: 'ide-btn',
    '[class.ide-btn--primary]': "type() === 'primary'",
    '[class.ide-btn--default]': "type() === 'default'",
    '[class.ide-btn--dashed]': "type() === 'dashed'",
    '[class.ide-btn--text]': "type() === 'text'",
    '[class.ide-btn--link]': "type() === 'link'",
    '[class.ide-btn--sm]': "size() === 'small'",
    '[class.ide-btn--lg]': "size() === 'large'",
  },
})
export class IdeButtonDirective {
  private readonly document = inject(DOCUMENT)

  /** Visual style of the button (replaces ng-zorro's `nzType`). */
  readonly type = input<IdeButtonType>('default')

  /** Height/padding scale of the button (replaces ng-zorro's `nzSize`). */
  readonly size = input<IdeButtonSize>('default')

  constructor() {
    this.ensureStylesInjected()
  }

  /** Adds the shared stylesheet to `<head>` exactly once for the whole app. */
  private ensureStylesInjected(): void {
    const doc = this.document
    if (doc.getElementById(STYLE_ELEMENT_ID)) {
      return
    }

    const style = doc.createElement('style')
    style.id = STYLE_ELEMENT_ID
    style.textContent = BUTTON_STYLES
    doc.head.appendChild(style)
  }
}
