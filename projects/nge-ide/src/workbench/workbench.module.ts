import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { NgeUiIconModule } from '@cisstech/nge/ui/icon'
import { AngularSplitModule } from 'angular-split'

import {
  CommandModule,
  EditorDirectivesModule,
  EditorPipesModule,
  TabComponent,
  TabsComponent,
  TooltipDirective,
} from '@cisstech/nge-ide/core'

import { WorkbenchComponent } from './workbench.component'

@NgModule({
  imports: [
    CommonModule,

    TabsComponent,
    TabComponent,
    TooltipDirective,

    CommandModule,
    NgeUiIconModule,
    EditorPipesModule,
    EditorDirectivesModule,
    AngularSplitModule,
  ],
  exports: [WorkbenchComponent],
  declarations: [WorkbenchComponent],
})
export class WorkbenchModule {}
