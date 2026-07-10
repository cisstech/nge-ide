import { FocusMonitor } from '@angular/cdk/a11y'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  viewChild,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

let nextUniqueId = 0

/**
 * A compact, VS-Code-like checkbox built on a native `<input type="checkbox">`.
 *
 * Replaces ng-zorro's `nz-checkbox`. It implements {@link ControlValueAccessor}
 * so it works with `[(ngModel)]` (and reactive forms), projects its label text
 * through `<ng-content>`, and exposes a `checkedChange` output (renamed from
 * `nzCheckedChange`).
 *
 * @example
 * ```html
 * <ide-checkbox [(ngModel)]="value" (checkedChange)="onChange()">Enable feature</ide-checkbox>
 * ```
 */
@Component({
  selector: 'ide-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private readonly focusMonitor = inject(FocusMonitor)
  private readonly destroyRef = inject(DestroyRef)

  private readonly inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input')

  /** Unique id shared between the native input (allows external `<label for>` if ever needed). */
  protected readonly inputId = `ide-checkbox-${nextUniqueId++}`

  /** Current checked state (source of truth for the view). */
  protected readonly checked = signal(false)

  /** Whether the control is disabled (driven by the input or by reactive forms). */
  protected readonly isDisabled = signal(false)

  /** True only when focus arrived via the keyboard, so a focus ring is shown. */
  protected readonly focusedByKeyboard = signal(false)

  /** Emits the new checked value whenever the user toggles the checkbox. */
  @Output() readonly checkedChange = new EventEmitter<boolean>()

  /** Disables user interaction. */
  @Input({ transform: booleanAttribute })
  set disabled(value: boolean) {
    this.isDisabled.set(value)
  }
  get disabled(): boolean {
    return this.isDisabled()
  }

  private onChange: (value: boolean) => void = () => {}
  private onTouched: () => void = () => {}

  ngAfterViewInit(): void {
    this.focusMonitor
      .monitor(this.inputRef().nativeElement)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((origin) => {
        this.focusedByKeyboard.set(origin === 'keyboard')
        if (!origin) {
          this.onTouched()
        }
      })
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.inputRef().nativeElement)
  }

  // ControlValueAccessor

  writeValue(value: unknown): void {
    this.checked.set(!!value)
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled)
  }

  protected handleChange(event: Event): void {
    const value = (event.target as HTMLInputElement).checked
    this.checked.set(value)
    this.onChange(value)
    this.checkedChange.emit(value)
  }
}
