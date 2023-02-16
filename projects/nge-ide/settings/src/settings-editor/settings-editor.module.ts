import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';

import { IDynamicModule } from '@cisstech/nge/services';
import { SettingsEditorComponent } from './settings-editor.component';
import { PipesModule } from '@cisstech/nge-ide/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,

    PipesModule,
  ],
  declarations: [SettingsEditorComponent],
})
export class SettingsEditorModule implements IDynamicModule {
  component = SettingsEditorComponent;
}
