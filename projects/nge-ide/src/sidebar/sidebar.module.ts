import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AngularSplitModule } from 'angular-split';
import { NgeUiIconModule } from '@mcisse/nge/ui/icon';
import { ViewModule } from '@mcisse/nge-ide/core';

import { SidebarComponent } from './sidebar.component';

@NgModule({
    imports: [
        CommonModule,

        DragDropModule,
        MatBadgeModule,
        MatTooltipModule,
        ViewModule,

        AngularSplitModule,
        NgeUiIconModule,
    ],
    exports: [
        SidebarComponent,
    ],
    declarations: [
        SidebarComponent,
    ],
})
export class SidebarModule {}
