import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IDynamicModule } from '@mcisse/nge/services';
import { NgeMonacoModule } from '@mcisse/nge/monaco';

import { CodeEditorComponent } from './code-editor.component';

@NgModule({
    imports: [
        CommonModule,
        NgeMonacoModule,
    ],
    declarations: [CodeEditorComponent],
})
export class CodeEditorModule implements IDynamicModule {
    component = CodeEditorComponent;
}
