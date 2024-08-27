import { Pipe, PipeTransform } from '@angular/core'
import { FileService } from '../files'
import { Paths } from '../utils/index'

@Pipe({
  name: 'fileName',
})
export class FileNamePipe implements PipeTransform {
  constructor(private readonly fileService: FileService) {}

  transform(value: monaco.Uri, showFullName?: boolean): string {
    if (showFullName) {
      const authority = this.fileService.entryName(value.with({ path: '/' }))
      return Paths.join([authority, value.path])
    }
    return Paths.basename(value.path) || value.path
  }
}
