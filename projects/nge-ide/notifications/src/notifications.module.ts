import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ViewModule } from '@mcisse/nge-ide/core';
import { IDynamicModule } from '@mcisse/nge/services';
import { NotificationsComponent } from './notifications.component';

@NgModule({
  imports: [
        CommonModule,
        MatBadgeModule,
        MatSelectModule,
        MatFormFieldModule,

        NzTabsModule,
        NzBadgeModule,
        NzSelectModule,

        ViewModule,
  ],
  exports: [NotificationsComponent],
  declarations: [NotificationsComponent],
})
export class NotificationsModule implements IDynamicModule {
    component = NotificationsComponent;
}
