import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject, signal } from '@angular/core'
import { IdeService, ITask, TaskService, ThemeService } from '@cisstech/nge-ide/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ide-root',
  templateUrl: 'ide.component.html',
  styleUrls: ['ide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  host: {
    '[attr.data-theme]': 'theme()',
    '(pointerdown)': 'onFirstInteraction()',
  },
})
export class IdeComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = []

  /** Resolved IDE theme ('light' | 'dark'); drives the `data-theme` host attribute. */
  protected readonly theme = inject(ThemeService).resolved

  task?: ITask

  /**
   * Flips to `true` once {@link IdeService.start} has resolved. Until then a
   * loading overlay covers the workspace, so the panes populating on startup (and
   * the theme applying) are hidden and the settled layout is revealed in one step.
   */
  protected readonly ready = signal(false)

  /**
   * Enables the split transitions, but only from the first user interaction. The
   * panes keep opening asynchronously for a moment after `ready` (containers
   * register through subscriptions), so animating before the user touches anything
   * would replay those as a stray open animation.
   */
  protected readonly animate = signal(false)

  constructor(
    private readonly ide: IdeService,
    private readonly taskService: TaskService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.subscriptions.push(
      this.taskService.current.subscribe((task) => {
        this.task = task
        this.changeDetectorRef.markForCheck()
      })
    )
    await this.ide.start()
    this.ready.set(true)
  }

  /** First pointer interaction after load turns on the split transitions. */
  protected onFirstInteraction(): void {
    if (this.ready() && !this.animate()) {
      this.animate.set(true)
    }
  }

  async ngOnDestroy(): Promise<void> {
    this.subscriptions.forEach((s) => s.unsubscribe())
    await this.ide.stop()
  }
}
