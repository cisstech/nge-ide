import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { CheckboxComponent, EditorPipesModule, IdeInputDirective, OptionComponent, SelectComponent } from '@cisstech/nge-ide/core'
import { IDynamicModule } from '@cisstech/nge/services'
import { SettingsEditorComponent } from './settings-editor.component'

@NgModule({
  imports: [CommonModule, FormsModule, IdeInputDirective, SelectComponent, OptionComponent, CheckboxComponent, EditorPipesModule],
  declarations: [SettingsEditorComponent],
  exports: [SettingsEditorComponent],
})
export class SettingsEditorModule implements IDynamicModule {
  component = SettingsEditorComponent
}
