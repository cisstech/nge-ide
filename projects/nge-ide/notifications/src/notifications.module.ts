import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ViewModule } from '@cisstech/nge-ide/core';
import { IDynamicModule } from '@cisstech/nge/services';
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
  declarations: [NotificationsComponent],
})
export class NotificationsModule implements IDynamicModule {
  component = NotificationsComponent;
}
