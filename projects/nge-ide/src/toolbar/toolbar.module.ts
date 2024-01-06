import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { NgeUiIconModule } from '@cisstech/nge/ui/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
  imports: [
    CommonModule,

    NzMenuModule,
    NzButtonModule,
    NzDividerModule,
    NzDropDownModule,

    NgeUiIconModule,
  ],
  exports: [ToolbarComponent],
  declarations: [ToolbarComponent],
})
export class ToolbarModule { }
