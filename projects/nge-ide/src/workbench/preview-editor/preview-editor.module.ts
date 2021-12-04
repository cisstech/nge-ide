import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgeMarkdownModule } from '@mcisse/nge/markdown';
import { SafePipeModule } from '@mcisse/nge/pipes';

import { IDynamicModule } from '@mcisse/nge/services';

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
