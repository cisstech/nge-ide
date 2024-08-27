import { Injector, NgModule, Injectable } from '@angular/core'
import {
  CommandService,
  CONTRIBUTION,
  IContribution,
  InfobarContainer,
  NotificationService,
  ViewContainerService,
  ViewService,
} from '@cisstech/nge-ide/core'
import { of } from 'rxjs'
import { NotificationCommandClear } from './commands'

/**
 * Identifier of the notifications view component.
 */
export const NOTIFICATIONS_VIEW_ID = 'workbench.view.notifications'

/**
 * Identifier of the notifications container.
 */
export const NOTIFICATIONS_CONTAINER_ID = 'workbench.container.notifications'

@Injectable()
export class Contribution implements IContribution {
  readonly id = 'workbench.contrib.notifications'

  activate(injector: Injector) {
    const viewService = injector.get(ViewService)
    const commandService = injector.get(CommandService)
    const notificationService = injector.get(NotificationService)
    const viewContainerService = injector.get(ViewContainerService)

    commandService.register(NotificationCommandClear)

    viewService.register({
      id: NOTIFICATIONS_VIEW_ID,
      title: 'NOTIFICATIONS',
      commands: of([commandService.find(NotificationCommandClear)]),
      viewContainerId: NOTIFICATIONS_CONTAINER_ID,
      component: () => import('./notifications.module').then((m) => m.NotificationsModule),
    })

    viewContainerService.register(
      new (class extends InfobarContainer {
        readonly id = NOTIFICATIONS_CONTAINER_ID
        readonly title = 'NOTIFICATIONS'
        readonly badge = notificationService.count
      })()
    )
  }
}

@NgModule({
  providers: [
    NotificationCommandClear,
    {
      provide: CONTRIBUTION,
      multi: true,
      useClass: Contribution,
    },
  ],
})
export class NgeIdeNotificationsModule {}
