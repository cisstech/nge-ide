import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import {
  CommandModule,
  DividerComponent,
  EditorDirectivesModule,
  EditorPipesModule,
  IdeMenuComponent,
  IdeMenuItemDirective,
  IdeMenuTriggerDirective,
  TooltipDirective,
} from '@cisstech/nge-ide/core'

import { IDynamicModule } from '@cisstech/nge/services'
import { NgeUiIconModule } from '@cisstech/nge/ui/icon'
import { NgeUiTreeModule } from '@cisstech/nge/ui/tree'

import { ExplorerComponent } from './explorer.component'
import { ExplorerFileIconOptionsPipe } from './pipes/explorer-file-icon-options.pipe'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommandModule,
    NgeUiIconModule,
    NgeUiTreeModule,
    EditorPipesModule,
    EditorDirectivesModule,
    ExplorerFileIconOptionsPipe,
    TooltipDirective,
    IdeMenuComponent,
    IdeMenuItemDirective,
    IdeMenuTriggerDirective,
    DividerComponent,
  ],
  declarations: [ExplorerComponent],
  exports: [ExplorerComponent],
})
export class ExplorerModule implements IDynamicModule {
  component = ExplorerComponent
}
