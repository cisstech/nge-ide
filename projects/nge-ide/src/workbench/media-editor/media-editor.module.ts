import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SafePipeModule } from '@cisstech/nge/pipes'
import { IDynamicModule } from '@cisstech/nge/services'

import { MediaEditorComponent } from './media-editor.component'

@NgModule({
  imports: [CommonModule, SafePipeModule],
  declarations: [MediaEditorComponent],
  exports: [MediaEditorComponent],
})
export class MediaEditorModule implements IDynamicModule {
  component = MediaEditorComponent
}
