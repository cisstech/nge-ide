import { NgModule } from '@angular/core';
import { FileChangedPipe } from './file-changed.pipe';
import { FileNamePipe } from './file-name.pipe';

@NgModule({
    exports: [FileNamePipe, FileChangedPipe],
    declarations: [FileNamePipe, FileChangedPipe],
})
export class FileModule { }
