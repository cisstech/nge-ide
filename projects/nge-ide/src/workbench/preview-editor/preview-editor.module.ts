import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IDynamicModule } from '@mcisse/nge/services';

import { PreviewEditorComponent } from './preview-editor.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        PreviewEditorComponent,
    ],
})
export class PreviewEditorModule implements IDynamicModule {
    component = PreviewEditorComponent
}
