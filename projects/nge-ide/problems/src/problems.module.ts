import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { IDynamicModule } from '@cisstech/nge/services';
import { NgeUiTreeModule } from '@cisstech/nge/ui/tree';
import { NgeUiIconModule } from '@cisstech/nge/ui/icon';

import { ProblemsComponent } from './problems.component';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    NgeUiTreeModule,
    NgeUiIconModule,
  ],
  declarations: [ProblemsComponent],
})
export class ProblemsModule implements IDynamicModule {
    component = ProblemsComponent;
}
