import { Injector } from '@angular/core';
import { Icon } from '@cisstech/nge/ui/icon';
import { EditorGroup } from './editor';
import { Preview } from './preview';
import { IFile } from '../files';

/**
 * Represents file open options.
 */
export interface OpenOptions {
  /**  Icon to show in the tabbar (default to a file icon). */
  readonly icon?: Icon;

  /**  Title to show in the tabbar. */
  readonly title: string;

  /**  Tooltip to show in the tabbar. */
  readonly tooltip: string;

  /** force the editor to open the file as a preview */
  readonly preview?: Preview;

  /** force the editor to open the file in a new group */
  readonly openToSide?: boolean;

  /** force the editor to open the file in this group */
  readonly openInGroup?: EditorGroup;

  /** jumping at the given position after the resource is opened */
  readonly position?: {
    line: number;
    column: number;
  };

  /** open the resource with diff editor */
  readonly diff?: string;
}

/**
 * Represents file open request.
 */
export class OpenRequest {
  constructor(
    /**
     * The uri to open.
     */
    readonly uri: monaco.Uri,

    /**
     * Editor scope injector.
     */
    readonly injector: Injector,
    /**
     * The options associated with the request.
     */
    readonly options: OpenOptions,
    /**
     * The file associated with the request if any.
     */
    readonly file?: IFile,
  ) {
    this.uri = uri;
    this.options = options;
  }

  equals(o: any): o is OpenRequest {
    if (!(o instanceof OpenRequest)) {
      return false;
    }
    return o.uri.with({ query: '' }).toString(true) == this.uri.with({ query: '' }).toString(true);
  }
}
