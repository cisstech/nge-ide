import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { SpinnerComponent } from '@cisstech/nge-ide/core'

import { IDynamicModule } from '@cisstech/nge/services'
import { NgeMonacoModule } from '@cisstech/nge/monaco'

import { CodeEditorComponent } from './code-editor.component'

@NgModule({
  imports: [CommonModule, SpinnerComponent, NgeMonacoModule],
  declarations: [CodeEditorComponent],
  exports: [CodeEditorComponent],
})
export class CodeEditorModule implements IDynamicModule {
  component = CodeEditorComponent
}
