import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDividerModule } from '@angular/material/divider';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
  imports: [
    CommonModule,

    MatMenuModule,
    MatButtonModule,
    MatDividerModule,

    NzDropDownModule,
  ],
  exports: [ToolbarComponent],
  declarations: [ToolbarComponent],
})
export class ToolbarModule {}
