import { Highlightable } from '@angular/cdk/a11y'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  inject,
  signal,
} from '@angular/core'

let nextUniqueId = 0

/** Payload emitted when an option is chosen. */
export interface IdeAutoOptionSelectionEvent {
  /** Option that was selected. */
  readonly source: IdeAutoOptionComponent
  /** True when the selection came from a user gesture (click or Enter). */
  readonly isUserInput: boolean
}

/**
 * A single selectable row inside an `<ide-autocomplete>` panel.
 *
 * Replaces ng-zorro's `nz-auto-option`. `value` (was `nzValue`) is the data
 * carried by the option and surfaced through the panel's `selectionChange`,
 * while `label` (was `nzLabel`) is the text written into the trigger input once
 * the option is picked. When `label` is omitted the projected text content is
 * used instead.
 *
 * @example
 * ```html
 * <ide-auto-option [value]="file" [label]="file.name">{{ file.name }}</ide-auto-option>
 * ```
 */
@Component({
  selector: 'ide-auto-option',
  standalone: true,
  templateUrl: './auto-option.component.html',
  styleUrls: ['./auto-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ide-auto-option',
    role: 'option',
    '[attr.id]': 'id',
    '[class.ide-auto-option--active]': 'active()',
    '[class.ide-auto-option--disabled]': 'disabled',
    '[attr.aria-selected]': 'active() ? "true" : "false"',
    '[attr.aria-disabled]': 'disabled ? "true" : null',
    '(click)': 'selectViaInteraction()',
    '(mousedown)': 'preventBlur($event)',
  },
})
export class IdeAutoOptionComponent implements Highlightable {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)

  /** Stable id used by the trigger for `aria-activedescendant`. */
  readonly id = `ide-auto-option-${nextUniqueId++}`

  /**
   * Data carried by the option, surfaced through the panel's `selectionChange`
   * as `$event.value` (was `nzValue`). Typed loosely, like ng-zorro's `nzValue`,
   * so consumers can read it without a cast.
   */
  @Input() value: any

  /** Text shown in the trigger input once the option is picked (was `nzLabel`). */
  @Input() label?: string

  /** Whether the option can be selected. */
  @Input({ transform: booleanAttribute }) disabled = false

  /** Emits when the user picks this option. */
  @Output() readonly selectionChange = new EventEmitter<IdeAutoOptionSelectionEvent>()

  /** Whether the option is currently highlighted by keyboard navigation. */
  protected readonly active = signal(false)

  /** Resolves the display label, falling back to the projected text content. */
  getLabel(): string {
    if (this.label != null) {
      return this.label
    }
    return (this.host.nativeElement.textContent ?? '').trim()
  }

  /** Highlightable: marks the option active for `ActiveDescendantKeyManager`. */
  setActiveStyles(): void {
    if (!this.active()) {
      this.active.set(true)
    }
  }

  /** Highlightable: clears the active highlight. */
  setInactiveStyles(): void {
    if (this.active()) {
      this.active.set(false)
    }
  }

  /** Scrolls the option into view inside the scrollable panel. */
  scrollIntoViewIfNeeded(): void {
    this.host.nativeElement.scrollIntoView?.({ block: 'nearest' })
  }

  /** Notifies the panel that the user picked this option. */
  selectViaInteraction(): void {
    if (!this.disabled) {
      this.selectionChange.emit({ source: this, isUserInput: true })
    }
  }

  /** Keeps focus on the trigger input so a click does not dismiss the panel first. */
  protected preventBlur(event: Event): void {
    event.preventDefault()
  }
}
