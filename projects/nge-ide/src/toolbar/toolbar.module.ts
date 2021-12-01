import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
    imports: [
        CommonModule,

        MatMenuModule,
        MatButtonModule,
        MatDividerModule,
    ],
    exports: [
        ToolbarComponent,
    ],
    declarations: [ToolbarComponent]
})
export class ToolbarModule { }
