import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'explorerFileIconOptions',
  standalone: true
})
export class ExplorerFileIconOptionsPipe implements PipeTransform {
  transform(node: any) {
    return {
      alt: node.name,
      isRoot: node.level === 0,
      expanded: node.expanded,
      isDirectory: node.expandable && node.data.isFolder
    }
  }
}
