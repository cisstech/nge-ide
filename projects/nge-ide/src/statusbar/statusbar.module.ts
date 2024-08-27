import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { SafePipeModule } from '@cisstech/nge/pipes'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'

import { StatusbarComponent } from './statusbar.component'

@NgModule({
  imports: [CommonModule, NzToolTipModule, SafePipeModule],
  exports: [StatusbarComponent],
  declarations: [StatusbarComponent],
})
export class StatusbarModule {}
