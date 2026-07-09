import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { SafePipeModule } from '@cisstech/nge/pipes'
import { NzTooltipModule } from 'ng-zorro-antd/tooltip'

import { StatusbarComponent } from './statusbar.component'

@NgModule({
  imports: [CommonModule, NzTooltipModule, SafePipeModule],
  exports: [StatusbarComponent],
  declarations: [StatusbarComponent],
})
export class StatusbarModule {}
