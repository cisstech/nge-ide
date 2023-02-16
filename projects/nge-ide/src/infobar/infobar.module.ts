import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommandModule, ViewModule } from '@cisstech/nge-ide/core';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { InfobarComponent } from './infobar.component';

@NgModule({
  declarations: [InfobarComponent],
  imports: [
    CommonModule,
    FormsModule,

    NzTabsModule,
    NzBadgeModule,
    NzSelectModule,

    ViewModule,
    CommandModule,
  ],
  exports: [InfobarComponent],
})
export class InfobarModule {}
