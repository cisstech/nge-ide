import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { CommandModule, DirectivesModule } from '@cisstech/nge-ide/core';

import { IDynamicModule } from '@cisstech/nge/services';
import { NgeUiIconModule } from '@cisstech/nge/ui/icon';
import { NgeUiTreeModule } from '@cisstech/nge/ui/tree';

import { ExplorerComponent } from './explorer.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        MatTooltipModule,

        NzDropDownModule,

        CommandModule,

        NgeUiIconModule,
        NgeUiTreeModule,
        DirectivesModule,
    ],
    declarations: [ExplorerComponent],
})
export class ExplorerModule implements IDynamicModule {
    component = ExplorerComponent
}
