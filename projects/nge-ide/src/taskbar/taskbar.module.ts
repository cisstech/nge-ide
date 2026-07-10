import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SpinnerComponent } from '@cisstech/nge-ide/core'

import { TaskbarComponent } from './taskbar.component'

@NgModule({
  imports: [CommonModule, SpinnerComponent],
  exports: [TaskbarComponent],
  declarations: [TaskbarComponent],
})
export class TaskbarModule {}
