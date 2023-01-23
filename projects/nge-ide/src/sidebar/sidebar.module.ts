import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { AngularSplitModule } from 'angular-split';
import { NgeUiIconModule } from '@cisstech/nge/ui/icon';
import { ViewModule } from '@cisstech/nge-ide/core';

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
