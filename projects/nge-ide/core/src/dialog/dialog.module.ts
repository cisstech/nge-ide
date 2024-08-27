import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { NzModalModule } from 'ng-zorro-antd/modal'
import { DialogService } from './dialog.service'

@NgModule({
  providers: [DialogService],
  imports: [CommonModule, NzModalModule],
  exports: [NzModalModule],
})
export class DialogModule {}
