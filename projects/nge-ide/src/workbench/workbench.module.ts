import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { NzTabsModule } from 'ng-zorro-antd/tabs'

import { NgeUiIconModule } from '@cisstech/nge/ui/icon'
import { AngularSplitModule } from 'angular-split'

import { CommandModule, EditorDirectivesModule, EditorPipesModule } from '@cisstech/nge-ide/core'

import { NzTooltipModule } from 'ng-zorro-antd/tooltip'
import { WorkbenchComponent } from './workbench.component'

@NgModule({
  imports: [
    CommonModule,

    NzTabsModule,

    NzTooltipModule,

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
