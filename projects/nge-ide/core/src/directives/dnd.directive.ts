import {
  AfterContentInit,
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

/**
 * Data passed to dataTransfer.setData method when a data is dragged using DndDirective.
 */
export const DndDataTransfer = 'dnd-data';

/**
 * Element that can share or accept a data of dragged dom element.
 *
 * - the class `dnd-over` is added to the element when a dragged data hover the element.
 * - the class `dnd-drag` is added to the element when the element is dragged.
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[dnd]',
})
export class DndDirective implements AfterContentInit {
  @Input()
  dndTarget = 0;

  /**
   * A value indicating whether the element can share a data or not
   */
  @Input()
  draggable = true;

  /**
   * A value indicating whether a data can be dropped to this element
   */
  @Input()
  droppable = true;

  /**
   * emits after a data is dropped.
   */
  @Output()
  dropped: EventEmitter<DndData> = new EventEmitter();

  /** emits after a data hover the element */
  @Output()
  hovered: EventEmitter<any> = new EventEmitter();

  /** The data to share with the element */
  @Input()
  dndData: any;

  constructor(private el: ElementRef) {}

  ngAfterContentInit() {
    this.setDraggable();
    this.setDroppable();
  }

  private setDraggable() {
    const node = this.el.nativeElement;
    node.draggable = true;

    const dragstart = (e: DragEvent) => {
      if (!this.draggable) {
        e.preventDefault();
        return;
      }
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData(DndDataTransfer, this.dndData);
        if (typeof this.dndData === 'string') {
          // standard way to share a string data, this is handled by most applications
          // like vscode, chrome, firefox, etc.
          e.dataTransfer.setData('text/plain', this.dndData);
        }
      }
      node.classList.add('dnd-drag');
      return false;
    };
    node.addEventListener('dragstart', dragstart, false);

    const dragend = (e: DragEvent) => {
      node.classList.remove('dnd-drag');
      return false;
    };
    node.addEventListener('dragend', dragend, false);
  }

  private setDroppable() {
    if (!this.droppable) {
      return;
    }

    const node: HTMLElement = this.el.nativeElement;
    node.draggable = true;

    const ancestor = (e: HTMLElement) => {
      let i = 0;
      while (i < this.dndTarget && e.parentElement) {
        e = e.parentElement;
        i++;
      }
      return e;
    };

    const dragover = (e: DragEvent) => {
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
      if (e.preventDefault) {
        e.preventDefault();
      }
      ancestor(node).classList.add('dnd-over');
      this.hovered.emit(true);
      return false;
    };
    node.addEventListener('dragover', dragover, false);

    const dragenter = (e: DragEvent) => {
      ancestor(node).classList.remove('dnd-over');
      this.hovered.emit(true);
      return false;
    };
    node.addEventListener('dragenter', dragenter, false);

    const dragleave = (e: DragEvent) => {
      ancestor(node).classList.remove('dnd-over');
      this.hovered.emit(false);
      return false;
    };
    node.addEventListener('dragleave', dragleave, false);

    const drop = (e: DragEvent) => {
      e.preventDefault();
      let file: File | null = null;
      if (e.dataTransfer) {
        if (e.dataTransfer.items.length > 0) {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < e.dataTransfer.items.length; i++) {
            const item = e.dataTransfer.items[i];
            const entry = item.webkitGetAsEntry();
            if (entry && entry.isFile) {
              file = item.getAsFile();
            }
          }
        } else if (e.dataTransfer.files.length > 0) {
          file = e.dataTransfer.files[0];
        }
      }

      if (e.stopPropagation) {
        e.stopPropagation();
      }

      ancestor(node).classList.remove('dnd-over');

      if (e.dataTransfer) {
        const dst = this.dndData;
        const src = e.dataTransfer.getData(DndDataTransfer);
        if (src || file) {
          this.dropped.emit({ src, file: file as any, dst });
        }
      }
      return false;
    };
    node.addEventListener('drop', drop, false);
  }
}

/** Representation of a data shared with a drag and drop action.  */
export interface DndData {
  /** the id of the source node in the dom */
  src?: string;
  /** the id of the destination node in the dom */
  dst?: string;
  /** the file dragged from the file system  */
  file?: File;
}
