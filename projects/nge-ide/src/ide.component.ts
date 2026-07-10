import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core'
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
  },
})
export class IdeComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = []

  /** Resolved IDE theme ('light' | 'dark'); drives the `data-theme` host attribute. */
  protected readonly theme = inject(ThemeService).resolved

  task?: ITask

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
  }

  async ngOnDestroy(): Promise<void> {
    this.subscriptions.forEach((s) => s.unsubscribe())
    await this.ide.stop()
  }
}
