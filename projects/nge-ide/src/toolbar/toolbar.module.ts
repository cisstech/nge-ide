import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { ToolbarComponent } from './toolbar.component';

@NgModule({
  imports: [
    CommonModule,

    NzButtonModule,
    NzDividerModule,
    NzDropDownModule,
  ],
  exports: [ToolbarComponent],
  declarations: [ToolbarComponent],
})
export class ToolbarModule { }
