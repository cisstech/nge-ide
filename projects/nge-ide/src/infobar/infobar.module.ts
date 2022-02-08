import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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
