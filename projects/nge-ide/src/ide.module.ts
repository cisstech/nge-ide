import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSplitModule } from 'angular-split';

import { CoreModule, EditorModule } from '@mcisse/nge-ide/core';

import { IdeComponent } from './ide.component';
import { InfobarModule } from './infobar/infobar.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { StatusbarModule } from './statusbar/statusbar.module';
import { WorkbenchModule } from './workbench/workbench.module';
import { ToolbarModule } from './toolbar/toolbar.module';

@NgModule({
    imports: [
        CommonModule,

        AngularSplitModule,

        CoreModule,
        EditorModule,

        InfobarModule,
        ToolbarModule,
        SidebarModule,
        StatusbarModule,
        WorkbenchModule,
    ],
    exports: [IdeComponent],
    declarations: [IdeComponent]
})
export class NgeIdeModule {}
