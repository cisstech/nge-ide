import { Injector } from '@angular/core';
import { URI } from 'vscode-uri';
import { compareURI } from '../files';
import { EditorGroup } from './editor';

/**
 * Represents file open options.
 */
export interface OpenOptions {
    /** force the editor to open the file in a new group */
    readonly openToSide?: boolean;

    /** force the editor to open the file in this group */
    readonly openInGroup?: EditorGroup;

    /** jumping at the given position after the resource is opened */
    readonly position?: {
        line: number;
        column: number;
    };

    /** custom tab title. */
    readonly tabTitle?: string;

    /** open the resource with diff editor */
    readonly diff?: {
        content: string
    };
}

/**
 * Represents file open request.
 */
export class OpenRequest {
    constructor(
        readonly uri: URI,
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
        return compareURI(o.uri, this.uri);
    }
}
