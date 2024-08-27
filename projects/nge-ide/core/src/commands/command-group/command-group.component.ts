import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { ICommand } from '../command'

@Component({
  selector: 'ide-command-group',
  templateUrl: 'command-group.component.html',
  styleUrls: ['./command-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandGroupComponent {
  @Input() commands: ICommand[] = []
  @Output() execute = new EventEmitter()

  _execute(command: ICommand, event: Event) {
    event.preventDefault()
    event.stopPropagation()
    if (this.execute.observers.length) {
      this.execute.next({
        event,
        command,
      })
    } else {
      command.execute()
    }
  }

  _trackById(_: number, command: ICommand): any {
    return command.id
  }
}
