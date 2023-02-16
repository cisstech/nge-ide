import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationService } from '@cisstech/nge-ide/core';

@Component({
  selector: 'ide-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  readonly empty = this.notificationService.isEmpty;
  readonly items = this.notificationService.items;

  constructor(private readonly notificationService: NotificationService) {}

  trackBy(index: number, _: any) {
    return index;
  }
}
