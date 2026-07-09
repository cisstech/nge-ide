import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { NgeUiIconModule } from '@cisstech/nge/ui/icon'
import { CommandGroupComponent } from './command-group/command-group.component'
import { NzTooltipModule } from 'ng-zorro-antd/tooltip'

@NgModule({
  declarations: [CommandGroupComponent],
  imports: [CommonModule, NzTooltipModule, NgeUiIconModule],
  exports: [CommandGroupComponent],
})
export class CommandModule {}
