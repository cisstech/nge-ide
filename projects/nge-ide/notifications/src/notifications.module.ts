import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ViewModule } from '@cisstech/nge-ide/core';
import { IDynamicModule } from '@cisstech/nge/services';
import { NotificationsComponent } from './notifications.component';

@NgModule({
  imports: [
    CommonModule,
    NzTabsModule,
    NzBadgeModule,
    NzSelectModule,
    ViewModule,
  ],
  declarations: [NotificationsComponent],
})
export class NotificationsModule implements IDynamicModule {
  component = NotificationsComponent;
}
