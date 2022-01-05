import { Injector, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OpenOptions, OpenRequest } from './opener';

declare type OpenHandler = (
    group: EditorGroup,
    editor: Editor,
    resource: monaco.Uri,
) => void;

declare type CloseHandler = (
    group: EditorGroup,
    resource: monaco.Uri,
    isPreview?: boolean,
) => void;

declare type CloseGuard = (
    group: EditorGroup,
    resource: monaco.Uri
) => Promise<boolean>;

interface EditorTab {
    readonly options: OpenOptions;
    readonly resource: monaco.Uri;
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
    readonly activeResource?: monaco.Uri;

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

    get options(): OpenOptions | undefined {
        return this.request.value?.options;
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


/**
 * Represents an editor group.
 *
 * An editor group is a container for editors. It is responsible for opening and closing editors.
 * A group can contains only one active editor at a time and on instance of a resource.
 */
export class EditorGroup {
    private static NEXT_ID = 0;

    private _tabs: EditorTab[] = [];
    private _request?: OpenRequest;
    private _history: EditorTab[] = [];
    private _activeIndex = 0;
    private _activeEditor?: Editor;

    /** Unique identifier of this group. */
    readonly id: string = 'editor-group#' + ++EditorGroup.NEXT_ID;

    get isEmpty(): boolean {
        return this._tabs.length === 0;
    }

    /** Tabs of the group. */
    get tabs(): EditorTab[] {
        return this._tabs;
    }

    /** Gets the index of the current active editor. */
    get activeIndex(): number {
        return this._activeIndex;;
    }

    /** Sets the index of the current active editor. */
    set activeIndex(index: number) {
        console.log(index);
        if (index === this._activeIndex) {
            console.log('activeIndex is already set to ' + index);
            return;
        }

        if (this._tabs[index]) {
            this._activeIndex = index;
            const { resource, options } = this._tabs[index];
            this.open(resource, options);
        }
    }

    /** Current active editor. */
    get activeEditor(): Editor | undefined {
        return this._activeEditor;
    }

    /** Current active resource. */
    get activeResource(): monaco.Uri | undefined {
        return this._request ? this._request.uri : undefined;
    }

    /**
     * Gets a value indicating whether the current active resource is in a preview mode.
     */
    get isInPreviewMode(): boolean {
        return !!this._request && !!this._request.options.preview;
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
    ) { }

    /**
     * Checks whether the resource is opened in the group.
     * @param resource the resource.
     * @param isPreview if `true`, check if the resource is opened as a preview.
     * @throws {ReferenceError} if any of the arguments is null.
     */
    contains(resource: monaco.Uri): boolean {
        return this._tabs.some(e => {
            return e.resource.toString() === resource.toString();
        });
    }

    /**
     * Checks whether the resource is opened in the group as a preview.
     * @param resource the resource.
     * @throws {ReferenceError} if any of the arguments is null.
     */
    containsPreview(resource: monaco.Uri): boolean {
        return this._tabs.some(e => {
            return e.resource.toString() === resource.toString() && !!e.options.preview;
        });
    }

    /**
     * Checks if the given resource is currently active.
     * @param resource the resource.
     * @throws {ReferenceError} if any of the arguments is null.
     */
    isActive(resource: monaco.Uri): boolean {
        return this.activeResource?.toString() === resource.toString();
    }

    /**
     * Gets th index of the given resource inside the group.
     * @param resource the resource to check the index for.
     * @returns The index of the resource or `-1` if the resource is not opened.
     */
    findIndex(resource: monaco.Uri): number {
        return this._tabs.findIndex(e => {
            return e.resource.toString() === resource.toString();
        });
    }

    /**
     * Add an editor tab for the given resource inside the group.
     *
     * Note :
     * A new tab will be created only if the resource is not opened in the group, otherwise the existing tab will be reused.
     *
     * @param resource the resource to open.
     * @param options options to pass to the editor that will open the resource.
     * @throws {ReferenceError} if any of the arguments is null.
     * @returns An promise that resolve once the resource is opened.
     */
    async open(resource: monaco.Uri, options: OpenOptions): Promise<void> {
        if (this.isActive(resource) && !options.preview)
            return;

        return new Promise<void>((resolve, reject) => {
            const request = new OpenRequest(resource, this.injector, options);

            let editor = this._activeEditor;
            if (!editor?.canHandle(request)) {
                editor = this.editors.find(e => e.canHandle(request));
            }

            if (!editor) {
                reject(`There is no registered editor to open "${request.uri.path}"`);
                return;
            }

            editor.handle(request);

            if (!this.contains(resource)) {
                this._tabs.push({ options, resource });
            }

            this._request = request;
            this._activeIndex = this.findIndex(resource);
            this._activeEditor = editor;
            this._history.push(this._tabs[this._activeIndex]);

            this.opened(this, editor, resource);

            resolve();
        });
    }

    /**
     * Removes a resource from the group if it has not changed
     * otherwise ask the user to confirme the closing.
     *
     * Note :
     * The resource will be alwayes removed if it is opened as a preview.
     *
     * @param resource the resource to close.
     * @param force When `true`, force close the resource without asking to save dirty files.
     * @throws {ReferenceError} if any of the arguments is null.
     * @returns A promise that resolve with `true` if the resource is removed `false` otherwise.
     */
    async close(resource: monaco.Uri, force?: boolean): Promise<boolean> {
        const index = this.findIndex(resource);
        if (index === -1)
            return false;

        let tab = this._tabs[index];
        const closeable = force || // close if forced
            tab.options.preview || // preview resource is always closeable
            await this.closeGuard(this, tab.resource); // check if dirty

        if (!closeable)
            return false;

        this._tabs.splice(index, 1);

        if (this.isEmpty || this.isActive(resource)) {
            this._request = undefined;
            this._activeIndex = -1;
            this._activeEditor = undefined;
        }

        this.closed(this, tab.resource, !!tab.options.preview);

        return true;
    }


    /**
     * Closes all the resources of the group.
     * @param force When `true`, force close the files without asking to save dirty files.
     * @returns A promise that resolve once the closing succeed or fail.
     */
    async closeAll(force?: boolean): Promise<boolean> {
        while (this._tabs.length) {
            if (!(await this.close(this._tabs[0].resource, force))) {
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
