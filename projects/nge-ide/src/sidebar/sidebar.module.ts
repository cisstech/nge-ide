import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { DragDropModule } from '@angular/cdk/drag-drop'

import { AngularSplitModule } from 'angular-split'
import { NgeUiIconModule } from '@cisstech/nge/ui/icon'
import {
  BadgeComponent,
  IdeMenuComponent,
  IdeMenuItemDirective,
  IdeMenuTriggerDirective,
  TooltipDirective,
  ViewModule,
} from '@cisstech/nge-ide/core'

import { SidebarComponent } from './sidebar.component'

@NgModule({
  imports: [
    CommonModule,

    ViewModule,
    DragDropModule,
    BadgeComponent,
    TooltipDirective,
    IdeMenuComponent,
    IdeMenuItemDirective,
    IdeMenuTriggerDirective,

    AngularSplitModule,
    NgeUiIconModule,
  ],
  exports: [SidebarComponent],
  declarations: [SidebarComponent],
})
export class SidebarModule {}
