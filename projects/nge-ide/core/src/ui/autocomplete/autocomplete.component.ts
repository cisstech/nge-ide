import { ActiveDescendantKeyManager } from '@angular/cdk/a11y'
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  inject,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Observable, defer, merge } from 'rxjs'
import { startWith, switchMap } from 'rxjs/operators'
import { IdeAutoOptionComponent, IdeAutoOptionSelectionEvent } from './auto-option.component'

let nextUniqueId = 0

/**
 * Floating list of `<ide-auto-option>` items shown under an input by the
 * `[ideAutocomplete]` trigger.
 *
 * Replaces ng-zorro's `nz-autocomplete`. Reference it with a template variable
 * and hand it to the trigger:
 *
 * @example
 * ```html
 * <input [ideAutocomplete]="auto" />
 * <ide-autocomplete #auto backfill (selectionChange)="onSelected($event.value)">
 *   <ide-auto-option [value]="item" [label]="item.name">{{ item.name }}</ide-auto-option>
 * </ide-autocomplete>
 * ```
 *
 * `backfill` (was `nzBackfill`) previews the highlighted option in the input
 * during keyboard navigation, and `selectionChange` emits the chosen option so
 * consumers read `$event.value` (was `$event.nzValue`).
 */
@Component({
  selector: 'ide-autocomplete',
  standalone: true,
  exportAs: 'ideAutocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdeAutocompleteComponent implements AfterContentInit {
  private readonly destroyRef = inject(DestroyRef)

  /** Id of the listbox element, referenced by the trigger's `aria-controls`. */
  readonly id = `ide-autocomplete-${nextUniqueId++}`

  /** Previews the highlighted option in the input while navigating (was `nzBackfill`). */
  @Input({ transform: booleanAttribute }) backfill = false

  /** Accessible name for the listbox. */
  @Input() ariaLabel?: string

  /** Emits the chosen option; read `$event.value` (was `nzValue`). */
  @Output() readonly selectionChange = new EventEmitter<IdeAutoOptionComponent>()

  /** Template stamped into the CDK overlay by the trigger. */
  @ViewChild(TemplateRef, { static: true }) readonly template!: TemplateRef<unknown>

  /** Options projected by the consumer. */
  @ContentChildren(IdeAutoOptionComponent, { descendants: true })
  readonly options!: QueryList<IdeAutoOptionComponent>

  /** Keyboard navigation manager over {@link options}. */
  keyManager?: ActiveDescendantKeyManager<IdeAutoOptionComponent>

  /** Whether there is at least one option to display. */
  protected readonly showPanel = signal(false)

  ngAfterContentInit(): void {
    this.keyManager = new ActiveDescendantKeyManager<IdeAutoOptionComponent>(this.options)
      .withWrap()
      .skipPredicate((option) => option.disabled)

    this.updateShowPanel()
    this.options.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateShowPanel())
  }

  /** Stream of user selections merged across the current set of options. */
  get optionSelectionChanges(): Observable<IdeAutoOptionSelectionEvent> {
    return defer(() =>
      this.options.changes.pipe(
        startWith(this.options),
        switchMap((options: QueryList<IdeAutoOptionComponent>) =>
          merge(...options.map((option) => option.selectionChange))
        )
      )
    )
  }

  /** Re-emits {@link selectionChange} for the option chosen through the trigger. */
  emitSelectionChange(option: IdeAutoOptionComponent): void {
    this.selectionChange.emit(option)
  }

  /** Recomputes {@link showPanel} from the current number of options. */
  private updateShowPanel(): void {
    this.showPanel.set(this.options.length > 0)
  }
}
