import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import {
  BadgeComponent,
  OptionComponent,
  SelectComponent,
  TabComponent,
  TabsComponent,
  ViewModule,
} from '@cisstech/nge-ide/core'
import { IDynamicModule } from '@cisstech/nge/services'
import { NotificationsComponent } from './notifications.component'

@NgModule({
  imports: [CommonModule, TabsComponent, TabComponent, BadgeComponent, SelectComponent, OptionComponent, ViewModule],
  declarations: [NotificationsComponent],
  exports: [NotificationsComponent],
})
export class NotificationsModule implements IDynamicModule {
  component = NotificationsComponent
}
