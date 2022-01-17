import { Injector } from '@angular/core';
import { Icon } from '@mcisse/nge/ui/icon';
import { EditorGroup } from './editor';
import { Preview } from './preview';

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
        readonly uri: monaco.Uri,
        readonly injector: Injector,
        readonly options: OpenOptions,
    ) {
        this.uri = uri;
        this.options = options;
    }

    equals(o: any): o is OpenRequest {
        if (!(o instanceof OpenRequest)) {
            return false;
        }
        return o.uri.toString(true) == this.uri.toString(true);
    }
}
