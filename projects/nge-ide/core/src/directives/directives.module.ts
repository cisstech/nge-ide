import { NgModule } from '@angular/core';
import { DndDirective } from './dnd.directive';
import { EditorDirective } from './editor.directive';
import { HighlightDirective } from './highlight.directive';

const declarations = [DndDirective, EditorDirective, HighlightDirective];

@NgModule({
  exports: [...declarations],
  declarations: [...declarations],
})
export class DirectivesModule {}
