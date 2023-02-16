import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { SafePipeModule } from '@cisstech/nge/pipes';

import { StatusbarComponent } from './statusbar.component';

@NgModule({
  imports: [
    CommonModule,

    MatTooltipModule,
    MatProgressSpinnerModule,

    SafePipeModule,
  ],
  exports: [StatusbarComponent],
  declarations: [StatusbarComponent],
})
export class StatusbarModule {}
