import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileService } from '../files/index';


@Pipe({
    name: 'fileChanged'
})
export class FileChangedPipe implements PipeTransform {
    constructor(
        private readonly fileService: FileService
    ) {}

    transform(value: monaco.Uri): Observable<boolean> {
        return this.fileService.contentChange(value).pipe(
            map(content => !!content?.changed)
        );
    }
}
