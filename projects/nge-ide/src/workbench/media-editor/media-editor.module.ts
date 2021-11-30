import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafePipeModule } from '@mcisse/nge/pipes';
import { IDynamicModule } from '@mcisse/nge/services';

import { MediaEditorComponent } from './media-editor.component';

@NgModule({
    imports: [
        CommonModule,
        SafePipeModule,
    ],
    declarations: [MediaEditorComponent],
})
export class MediaEditorModule implements IDynamicModule {
    component = MediaEditorComponent;
}
