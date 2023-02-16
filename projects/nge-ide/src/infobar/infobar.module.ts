import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

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

    MatBadgeModule,
    MatSelectModule,
    MatFormFieldModule,

    NzTabsModule,
    NzBadgeModule,
    NzSelectModule,

    ViewModule,
    CommandModule,
  ],
  exports: [InfobarComponent],
})
export class InfobarModule {}
