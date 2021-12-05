import { Pipe, PipeTransform } from '@angular/core';
import { URI } from 'vscode-uri';
import { Paths } from '../utils/index';

@Pipe({
    name: 'fileName'
})
export class FileNamePipe implements PipeTransform {
    transform(value: URI): string {
        return Paths.basename(value.path) || value.path;
    }
}
