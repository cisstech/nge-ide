import { Injector, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { URI } from 'vscode-uri';
import { compareURI } from '../files';
import { OpenOptions, OpenRequest } from './opener';

declare type OpenHandler = (
    group: EditorGroup,
    editor: Editor,
    resource: URI,
) => void;

declare type CloseHandler = (
    group: EditorGroup,
    toClose: URI,
    toFocus?: URI
) => void;

declare type CloseGuard = (
    group: EditorGroup,
    resource: URI
) => Promise<boolean>;

interface GroupTab {
    readonly resource: URI;
    readonly title: string;
}

/**
 * Represents the state of the editor.
 */
export interface EditorState {
    /** Current active editor group (the one focused in the workspace could be `null`) */
    readonly activeGroup?: EditorGroup;

    /** Current active editor (the one focused in the `activeGroup` could be `null`). */
    readonly activeEditor?: Editor;

    /** Current active resource (the one focused in explorer tree could be `null`). */
    readonly activeResource?: URI;

    /** Current visible editors */
    readonly visibleEditors: ReadonlyArray<Editor>;
}

/** Represents an editor that is attached to a component. */
export abstract class Editor {
    private static NEXT_ID = 0;
    private readonly request = new BehaviorSubject<OpenRequest | undefined>(undefined);

    /** unique identifier of the editor */
    readonly id: string = 'editor#' + ++Editor.NEXT_ID;

    abstract readonly component: () => (Type<any> | Promise<Type<any>>);

    get name(): string {
        return this.constructor.name;
    }

    get onChangeRequest(): Observable<OpenRequest> {
        return this.request.asObservable() as Observable<OpenRequest>;
    }

    /**
     * Checks whether this editor can handle the given `request`.
     * @param request the request to handle.
     */
    abstract canHandle(request: OpenRequest): boolean;

    handle(request: OpenRequest): boolean {
        if (this.canHandle(request)) {
            this.request.next(request);
            return true;
        }
        return false;
    }

    equals(o: any): boolean {
        if (!(o instanceof Editor)) {
            return false;
        }
        return o.id === this.id;
    }
}


export class EditorGroup {
    private static NEXT_ID = 0;

    private _tabs: GroupTab[] = [];
    private _request?: OpenRequest;
    private _activeEditor?: Editor;
    private _activeIndex = 0;

    /** Unique identifier of this group. */
    readonly id: string = 'editor-group#' + ++EditorGroup.NEXT_ID;

    get isEmpty(): boolean {
        return this._tabs.length === 0;
    }

    get tabs(): GroupTab[] {
        return this._tabs;
    }

    get activeEditor(): Editor | undefined {
        return this._activeEditor;
    }

    get activeResource(): URI | undefined {
        return this._request ? this._request.uri : undefined;
    }

    get activeIndex(): number {
        return this._activeIndex;;
    }

    set activeIndex(index: number) {
        if (this._activeIndex === index) {
            return;
        }

        this._activeIndex = index;
        if (this._tabs[index]) {
            this.open(this._tabs[index], {});
        }
    }

    constructor(
        private readonly injector: Injector,

        /**
         * Called after a resource is opened|focused inside the group.
         * @param group the group.
         * @param editor the editor on which the resource is opened|focused.
         * @param resource the resource.
         */
        private readonly opened: OpenHandler,

        /**
         * Called after a resource is removed from the group.
         * @param group the group.
         * @param closedResource the closed resource.
         * @param nextResource the new resource to focus.
         */
        private readonly closed: CloseHandler,

        /**
         * Called before resource is closed.
         * @param group the group.
         * @param resource the resource to close.
         * @returns A promise that resolve with `true` to confirm the closing
         * or `false` to cancel it.
         */
        private readonly closeGuard: CloseGuard,

        /** the registered editor. */
        private readonly editors: ReadonlyArray<Editor>,
    ) {}

    /**
     * Checks whether the resource is opened in the group.
     * @param resource the resource.
     * @throws {ReferenceError} if any of the arguments is null.
     */
    contains(resource: URI): boolean {
        return this._tabs.some(e => compareURI(e.resource, resource));
    }

    /**
     * Checks if the given resource is currently active.
     * @param resource the resource.
     * @throws {ReferenceError} if any of the arguments is null.
     */
    isActive(resource: URI): boolean {
        if (!this._request) {
            return false;
        }

        return compareURI(resource, this._request.uri);
    }

    /**
     * Opens a resoucr inside the group.
     *
     * Note: this method will creates a new instance of a component able
     * to open the resource only if needed otherwise it will reuse an existing one.
     * @param tab the resource to open.
     * @param options options to pass to the editor that will open the resource.
     * @throws {ReferenceError} if any of the arguments is null.
     * @returns An promise that resolve once the resource is opened.
     */
    async open(tab: GroupTab, options: OpenOptions): Promise<void> {
        const resource = tab.resource;
        const request = new OpenRequest(resource, this.injector, options);

        return new Promise<void>((resolve, reject) => {
            let editor = this.editors.find(o => o.canHandle(request));
            if (!editor) {
                reject(
                    `EditorNotFound: There is no registered editor to open "${request.uri.path}"`
                );
                return;
            }

            if (editor.name === this._activeEditor?.name) { // open with active editor if possible
                editor = this._activeEditor;
            }

            this._request = request;
            this._activeEditor = editor;

            editor.handle(request);

            if (!this.contains(resource)) {
                this._tabs.push(tab);
            }

            this._activeIndex = this._tabs.findIndex(e => {
                return compareURI(e.resource, resource);
            }) || 0;

            this.opened(this, editor, resource);

            resolve();
        });
    }

    /**
     * Removes a resource from the group.
     * @param resource the resource to close.
     * @throws {ReferenceError} if any of the arguments is null.
     * @returns A promise that resolve with `true` if the resource is removed `false` otherwise.
     */
    async close(resource: URI): Promise<boolean> {
        const index = this._tabs.findIndex(e => compareURI(e.resource, resource));
        if (index !== -1) {
            const canClose = await this.closeGuard(this, this._tabs[index].resource);
            if (!canClose) {
                return false;
            }

            const toClose = this._tabs.splice(index, 1).pop()?.resource as URI;
            if (this.isActive(resource) || this.isEmpty) {
                this._request = undefined;
                this._activeEditor = undefined;
            }

            const newIndex = Math.max(0, index - 1);
            let toFocus: URI | undefined;
            if (!this.activeResource && newIndex < this._tabs.length) {
                toFocus = this._tabs[newIndex].resource;
            }

            this.closed(this, toClose, toFocus);
            return true;
        }

        return false;
    }

    /**
     * Closes all the resources of the group.
     * @returns A promise that resolve once the closing succeed or fail.
     */
    async closeAll(): Promise<boolean> {
        while (this._tabs.length) {
            if (!(await this.close(this._tabs[0].resource))) {
                return false;
            }
        }
        return true;
    }

    equals(o: any): boolean {
        if (!(o instanceof EditorGroup)) {
            return false;
        }
        return o.id === this.id;
    }
}
