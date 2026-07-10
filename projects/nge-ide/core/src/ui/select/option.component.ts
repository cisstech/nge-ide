import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

/**
 * A single choice inside an {@link SelectComponent} (`ide-select`).
 *
 * Replaces ng-zorro's `nz-option`. It is a lightweight, non-visual declaration:
 * `ide-select` reads its {@link value} and {@link label} through a content query
 * and renders the actual keyboard-accessible option row itself (inside the
 * dropdown overlay). The `[nzValue]` / `[nzLabel]` inputs become plain
 * `value` / `label`.
 *
 * @example
 * ```html
 * <ide-select [(ngModel)]="selected">
 *   <ide-option [value]="1" label="One"></ide-option>
 *   <ide-option [value]="2" label="Two"></ide-option>
 * </ide-select>
 * ```
 */
@Component({
  selector: 'ide-option',
  standalone: true,
  template: '',
  styles: [':host { display: none; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent {
  /** Value bound to the form control when this option is selected. */
  readonly value = input<unknown>()

  /** Text shown for this option in the trigger and the dropdown. */
  readonly label = input<string>()

  /** Display text: the explicit label, falling back to the value when unset. */
  readonly displayLabel = computed<string>(() => {
    const label = this.label()
    if (label != null && label !== '') {
      return label
    }
    const value = this.value()
    return value == null ? '' : String(value)
  })
}
