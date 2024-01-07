import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

import { AngularSplitModule } from 'angular-split';
import { NgeUiIconModule } from '@cisstech/nge/ui/icon';
import { ViewModule } from '@cisstech/nge-ide/core';

import { SidebarComponent } from './sidebar.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  imports: [
    CommonModule,

    ViewModule,
    DragDropModule,
    NzBadgeModule,
    NzDropDownModule,
    NzToolTipModule,

    AngularSplitModule,
    NgeUiIconModule,
  ],
  exports: [SidebarComponent],
  declarations: [SidebarComponent],
})
export class SidebarModule {}
