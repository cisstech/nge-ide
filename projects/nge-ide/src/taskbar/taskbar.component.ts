import { Component, Input } from '@angular/core';
import { ITask } from '@cisstech/nge-ide/core';

@Component({
  selector: 'ide-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss'],
})
export class TaskbarComponent {
  @Input() task!: ITask;
}
