import { PortalModule } from '@angular/cdk/portal'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AngularSplitModule } from 'angular-split'
import { CommandModule } from '../commands/command.module'
import { ViewGroupComponent } from './view-group/view-group.component'
import { ViewDirective } from './view.directive'

@NgModule({
  imports: [CommonModule, PortalModule, AngularSplitModule, CommandModule],
  exports: [ViewDirective, ViewGroupComponent],
  declarations: [ViewDirective, ViewGroupComponent],
})
export class ViewModule {}
