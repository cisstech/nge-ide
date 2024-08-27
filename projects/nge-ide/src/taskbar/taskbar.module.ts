import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { NzSpinModule } from 'ng-zorro-antd/spin'

import { TaskbarComponent } from './taskbar.component'

@NgModule({
  imports: [CommonModule, NzSpinModule],
  exports: [TaskbarComponent],
  declarations: [TaskbarComponent],
})
export class TaskbarModule {}
