import { NgModule } from '@angular/core';
import { FileChangedPipe } from './file-changed.pipe';
import { FileNamePipe } from './file-name.pipe';
import { NicifyNamePipe } from './nicify-name.pipe';

const declarations = [FileNamePipe, NicifyNamePipe, FileChangedPipe];

@NgModule({
  exports: [...declarations],
  declarations: [...declarations],
})
export class EditorPipesModule {}
