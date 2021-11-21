import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTooltipModule } from '@angular/material/tooltip';

import { IDynamicModule } from '@mcisse/nge/services';
import { NgeUiTreeModule } from '@mcisse/nge/ui/tree';
import { NgeUiIconModule } from '@mcisse/nge/ui/icon';

import { ProblemsComponent } from './problems.component';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    NgeUiTreeModule,
    NgeUiIconModule,
  ],
  exports: [ProblemsComponent],
  declarations: [ProblemsComponent],
})
export class ProblemsModule implements IDynamicModule {
    component = ProblemsComponent;
}
