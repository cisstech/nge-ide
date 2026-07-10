import { DOCUMENT, Directive, inject } from '@angular/core'

/** Id of the singleton `<style>` element shared by every `[ideInput]` control. */
const STYLE_ELEMENT_ID = 'ide-input-styles'

/**
 * Pure-CSS, VS-Code-like look for `[ideInput]` form controls.
 *
 * Every color resolves from an IDE theme variable with a dark-friendly fallback,
 * and the focus ring is driven entirely by the `:focus`/`:focus-visible` pseudo
 * classes (no JavaScript focus tracking). The rules are global on purpose so a
 * single injected stylesheet styles every input/textarea that carries the
 * attribute, mirroring how `nz-input` relies on a shared stylesheet.
 */
const INPUT_STYLES = `
input[ideInput],
textarea[ideInput] {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 4px 8px;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.4;
  color: var(--input-foreground, var(--foreground, #cccccc));
  background-color: var(--input-background, #2b2b2b);
  border: 1px solid var(--input-border, var(--tab-border, #3c3c3c));
  border-radius: 2px;
  outline: none;
  transition: border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
}

input[ideInput]::placeholder,
textarea[ideInput]::placeholder {
  color: var(--input-placeholderForeground, #8a8a8a);
  opacity: 1;
}

input[ideInput]:hover:not(:disabled):not([readonly]),
textarea[ideInput]:hover:not(:disabled):not([readonly]) {
  border-color: var(--input-border-hover, var(--focus-border, #0a84ff));
}

input[ideInput]:focus,
input[ideInput]:focus-visible,
textarea[ideInput]:focus,
textarea[ideInput]:focus-visible {
  border-color: var(--focus-border, #0a84ff);
  box-shadow: 0 0 0 1px var(--focus-border, #0a84ff);
}

input[ideInput]:disabled,
textarea[ideInput]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

textarea[ideInput] {
  min-height: 48px;
  line-height: 1.5;
  resize: vertical;
}
`

/**
 * Styling primitive that replaces ng-zorro's `nz-input`.
 *
 * Applied as an attribute on native `<input>` and `<textarea>` elements, it
 * gives them the compact, dark-friendly look of the IDE while leaving value
 * handling entirely to Angular's built-in value accessors. Because it adds no
 * `ControlValueAccessor` of its own it stays fully compatible with `[(ngModel)]`
 * (including `type="number"`), `formControl`, and reactive forms.
 *
 * The look is delivered as a single stylesheet injected into the document head
 * the first time any `[ideInput]` control is created, so consumers do not need
 * to import a global stylesheet.
 *
 * @example
 * ```html
 * <input type="text" ideInput [(ngModel)]="value" />
 * <input type="number" ideInput [(ngModel)]="count" />
 * <textarea ideInput [(ngModel)]="notes"></textarea>
 * ```
 */
@Directive({
  selector: 'input[ideInput], textarea[ideInput]',
  standalone: true,
  host: {
    class: 'ide-input',
  },
})
export class IdeInputDirective {
  private readonly document = inject(DOCUMENT)

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
    style.textContent = INPUT_STYLES
    doc.head.appendChild(style)
  }
}
