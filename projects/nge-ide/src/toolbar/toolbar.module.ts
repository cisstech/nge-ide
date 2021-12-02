import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
    imports: [
        CommonModule,

        MatMenuModule,
        MatButtonModule,
        MatDividerModule,

        NzDropDownModule,
    ],
    exports: [
        ToolbarComponent,
    ],
    declarations: [ToolbarComponent]
})
export class ToolbarModule { }
