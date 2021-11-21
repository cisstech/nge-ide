import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SafePipeModule } from '@mcisse/nge/pipes';

import { StatusbarComponent } from './statusbar.component';

@NgModule({
    imports: [
        CommonModule,

        MatTooltipModule,
        MatProgressSpinnerModule,

        SafePipeModule,
    ],
    exports: [
        StatusbarComponent,
    ],
    declarations: [
        StatusbarComponent,
    ],
})
export class StatusbarModule { }
