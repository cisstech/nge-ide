import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { ITask } from '@cisstech/nge-ide/core'

@Component({
  selector: 'ide-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TaskbarComponent {
  @Input() task!: ITask
}
