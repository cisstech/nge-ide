import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

import { A11yModule } from '@angular/cdk/a11y'

import { NgeUiIconModule } from '@cisstech/nge/ui/icon'

import {
  EditorPipesModule,
  IdeAutoOptionComponent,
  IdeAutocompleteComponent,
  IdeAutocompleteDirective,
} from '@cisstech/nge-ide/core'

import { QuickOpenComponent } from './quick-open.component'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    A11yModule,

    IdeAutocompleteComponent,
    IdeAutoOptionComponent,
    IdeAutocompleteDirective,

    EditorPipesModule,
    NgeUiIconModule,
  ],
  exports: [QuickOpenComponent],
  declarations: [QuickOpenComponent],
})
export class QuickOpenModule {}
