import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { NzDropDownModule } from 'ng-zorro-antd/dropdown'

import { CommandModule, EditorDirectivesModule, EditorPipesModule } from '@cisstech/nge-ide/core'

import { IDynamicModule } from '@cisstech/nge/services'
import { NgeUiIconModule } from '@cisstech/nge/ui/icon'
import { NgeUiTreeModule } from '@cisstech/nge/ui/tree'

import { ExplorerComponent } from './explorer.component'
import { ExplorerFileIconOptionsPipe } from './pipes/explorer-file-icon-options.pipe'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NzToolTipModule,
    NzDropDownModule,
    CommandModule,
    NgeUiIconModule,
    NgeUiTreeModule,
    EditorPipesModule,
    EditorDirectivesModule,
    ExplorerFileIconOptionsPipe,
  ],
  declarations: [ExplorerComponent],
  exports: [ExplorerComponent],
})
export class ExplorerModule implements IDynamicModule {
  component = ExplorerComponent
}
