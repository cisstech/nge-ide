import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { SafePipeModule } from '@cisstech/nge/pipes'
import { TooltipDirective } from '@cisstech/nge-ide/core'

import { StatusbarComponent } from './statusbar.component'

@NgModule({
  imports: [CommonModule, TooltipDirective, SafePipeModule],
  exports: [StatusbarComponent],
  declarations: [StatusbarComponent],
})
export class StatusbarModule {}
