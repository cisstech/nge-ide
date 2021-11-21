import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URI } from 'vscode-uri';
import { FileService } from '../files';


@Pipe({
    name: 'fileChanged'
})
export class FileChangedPipe implements PipeTransform {
    constructor(
        private readonly fileService: FileService
    ) {}

    transform(value: URI): Observable<boolean> {
        return this.fileService.contentChange(value).pipe(
            map(content => !!content?.changed)
        );
    }
}
