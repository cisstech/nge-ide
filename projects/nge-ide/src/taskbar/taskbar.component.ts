import { Component, Input } from '@angular/core';
import { ITask } from 'projects/nge-ide/core/src/tasks/task';

@Component({
  selector: 'ide-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss']
})
export class TaskbarComponent {
    @Input() task!: ITask;
}
