import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

import { A11yModule } from '@angular/cdk/a11y'
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete'

import { NgeUiIconModule } from '@cisstech/nge/ui/icon'

import { EditorPipesModule } from '@cisstech/nge-ide/core'

import { NzInputModule } from 'ng-zorro-antd/input'
import { QuickOpenComponent } from './quick-open.component'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    A11yModule,

    NzInputModule,
    NzAutocompleteModule,

    EditorPipesModule,
    NgeUiIconModule,
  ],
  exports: [QuickOpenComponent],
  declarations: [QuickOpenComponent],
})
export class QuickOpenModule {}
