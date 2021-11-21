import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { IDynamicModule } from '@mcisse/nge/services';
import { SettingsEditorComponent } from './settings-editor.component';
import { PipesModule } from '@mcisse/nge-ide/core';


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
