import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { IdeService, ITask, TaskService } from '@cisstech/nge-ide/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ide-root',
  templateUrl: 'ide.component.html',
  styleUrls: ['ide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdeComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = []

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
