import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';

import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { AngularSplitModule } from 'angular-split';
import { NgeUiIconModule } from '@cisstech/nge/ui/icon';

import {
  CommandModule,
  DirectivesModule,
  PipesModule,
} from '@cisstech/nge-ide/core';

import { WorkbenchComponent } from './workbench.component';

@NgModule({
  imports: [
    CommonModule,

    MatTooltipModule,
    MatProgressBarModule,
    NzTabsModule,

    CommandModule,
    NgeUiIconModule,
    PipesModule,
    DirectivesModule,
    AngularSplitModule,
  ],
  exports: [WorkbenchComponent],
  declarations: [WorkbenchComponent],
})
export class WorkbenchModule {}
