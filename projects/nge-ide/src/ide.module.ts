import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSplitModule } from 'angular-split';

import { CoreModule } from '@mcisse/nge-ide/core';

import { IdeComponent } from './ide.component';
import { InfobarModule } from './infobar/infobar.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { StatusbarModule } from './statusbar/statusbar.module';
import { WorkbenchModule } from './workbench/workbench.module';

@NgModule({
    imports: [
        CommonModule,

        AngularSplitModule,

        CoreModule,

        InfobarModule,
        SidebarModule,
        StatusbarModule,
        WorkbenchModule,
    ],
    exports: [IdeComponent],
    declarations: [IdeComponent]
})
export class NgeIdeModule {}
