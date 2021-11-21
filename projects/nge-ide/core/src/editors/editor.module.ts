import { NgModule } from '@angular/core';
import { EditorDirective } from './editor.directive';

@NgModule({
    exports: [EditorDirective],
    declarations: [EditorDirective],
})
export class EditorModule { }
