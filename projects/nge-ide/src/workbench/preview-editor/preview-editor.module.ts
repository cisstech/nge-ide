import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgeMarkdownModule } from '@cisstech/nge/markdown';
import { SafePipeModule } from '@cisstech/nge/pipes';

import { IDynamicModule } from '@cisstech/nge/services';

import { PreviewEditorComponent } from './preview-editor.component';

@NgModule({
    imports: [
        CommonModule,
        SafePipeModule,
        NgeMarkdownModule,
    ],
    declarations: [
        PreviewEditorComponent,
    ],
})
export class PreviewEditorModule implements IDynamicModule {
    component = PreviewEditorComponent
}
