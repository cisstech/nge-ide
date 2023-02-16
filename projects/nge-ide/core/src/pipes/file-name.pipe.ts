import { Pipe, PipeTransform } from '@angular/core';
import { Paths } from '../utils/index';

@Pipe({
  name: 'fileName',
})
export class FileNamePipe implements PipeTransform {
  transform(value: monaco.Uri): string {
    return Paths.basename(value.path) || value.path;
  }
}
