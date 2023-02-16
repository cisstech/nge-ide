import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { PipesModule } from '@cisstech/nge-ide/core';
import { IDynamicModule } from '@cisstech/nge/services';
import { SettingsEditorComponent } from './settings-editor.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzSelectModule,
    NzCheckboxModule,
    PipesModule,
  ],
  declarations: [SettingsEditorComponent],
})
export class SettingsEditorModule implements IDynamicModule {
  component = SettingsEditorComponent;
}
