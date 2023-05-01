import { Injectable } from '@angular/core';
import { ICommand, NotificationService } from '@cisstech/nge-ide/core';
import { CodIcon } from '@cisstech/nge/ui/icon';

export const NOTIFICATION_COMMAND_CLEAR = 'notification.commands.clear';

@Injectable()
export class NotificationCommandClear implements ICommand {
  readonly id = NOTIFICATION_COMMAND_CLEAR;
  readonly icon = new CodIcon('trash');
  readonly label = 'Effacer';
  readonly enabled = true;

  constructor(private readonly notificationService: NotificationService) {}

  execute() {
    this.notificationService.clear();
  }
}
