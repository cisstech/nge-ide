import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { IDynamicModule } from '@cisstech/nge/services'
import { NgeUiIconModule } from '@cisstech/nge/ui/icon'
import { NgeUiTreeModule } from '@cisstech/nge/ui/tree'

import { ProblemsComponent } from './problems.component'

@NgModule({
  imports: [CommonModule, NgeUiTreeModule, NgeUiIconModule],
  declarations: [ProblemsComponent],
  exports: [ProblemsComponent],
})
export class ProblemsModule implements IDynamicModule {
  component = ProblemsComponent
}
