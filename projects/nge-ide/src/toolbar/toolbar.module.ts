import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import {
  DividerComponent,
  IdeButtonDirective,
  IdeMenuComponent,
  IdeMenuItemDirective,
  IdeMenuTriggerDirective,
} from '@cisstech/nge-ide/core'

import { NgeUiIconModule } from '@cisstech/nge/ui/icon'
import { ToolbarComponent } from './toolbar.component'

@NgModule({
  imports: [
    CommonModule,
    IdeButtonDirective,
    DividerComponent,
    IdeMenuComponent,
    IdeMenuItemDirective,
    IdeMenuTriggerDirective,
    NgeUiIconModule,
  ],
  exports: [ToolbarComponent],
  declarations: [ToolbarComponent],
})
export class ToolbarModule {}
