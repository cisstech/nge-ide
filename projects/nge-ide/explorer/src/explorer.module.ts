import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { CommandModule } from '@mcisse/nge-ide/core';

import { IDynamicModule } from '@mcisse/nge/services';
import { NgeUiIconModule } from '@mcisse/nge/ui/icon';
import { NgeUiTreeModule } from '@mcisse/nge/ui/tree';

import { ExplorerComponent } from './explorer.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        MatTooltipModule,
        MatDividerModule,
        NzDropDownModule,

        CommandModule,

        NgeUiIconModule,
        NgeUiTreeModule,
    ],
    declarations: [
        ExplorerComponent,
    ],
})
export class ExplorerModule implements IDynamicModule {
    component = ExplorerComponent
}
