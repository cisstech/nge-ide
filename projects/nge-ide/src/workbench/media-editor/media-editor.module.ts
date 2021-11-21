import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IDynamicModule } from '@mcisse/nge/services';

import { MediaEditorComponent } from './media-editor.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [MediaEditorComponent],
})
export class MediaEditorModule implements IDynamicModule {
    component = MediaEditorComponent;
}
