import { Injector, Type } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { OpenOptions, OpenRequest } from './opener'
import { FileService, IFile } from '../files'

declare type OpenHandler = (group: EditorGroup, editor: Editor, resource: monaco.Uri) => void

declare type CloseHandler = (group: EditorGroup, resource: monaco.Uri) => void

declare type CloseGuard = (group: EditorGroup, resource: monaco.Uri) => Promise<boolean>

const sameResource = (a: monaco.Uri, b: monaco.Uri) => a.toString(true) === b.toString(true)

/** Whether a tab shows its resource in an editor or as a preview. */
export type EditorTabKind = 'editor' | 'preview'

export interface EditorTab {
  /** Whether the tab shows the resource in an editor or as a preview. */
  readonly kind: EditorTabKind

  /** The options associated with the tab. */
  readonly options: OpenOptions

  /** The uri of the resource. */
  readonly resource: monaco.Uri

  /** The file associated with the request if any. */
  readonly file?: IFile
}

/**
 * Represents the state of the editor.
 */
export interface EditorState {
  /** Current active editor group (the one focused in the workspace could be `null`) */
  readonly activeGroup?: EditorGroup

  /** Current active editor (the one focused in the `activeGroup` could be `null`). */
  readonly activeEditor?: Editor

  /** Current active resource (the one focused in explorer tree could be `null`). */
  readonly activeResource?: monaco.Uri

  /** Current visible editors */
  readonly visibleEditors: ReadonlyArray<Editor>
}

/** Represents an editor that is attached to a component. */
export abstract class Editor {
  private static NEXT_ID = 0
  private readonly request = new BehaviorSubject<OpenRequest | undefined>(undefined)

  /** unique identifier of the editor */
  readonly id: string = 'editor#' + ++Editor.NEXT_ID

  abstract readonly component: () => Type<any> | Promise<Type<any>>

  get name(): string {
    return this.constructor.name
  }

  get options(): OpenOptions | undefined {
    return this.request.value?.options
  }

  get onChangeRequest(): Observable<OpenRequest> {
    return this.request.asObservable() as Observable<OpenRequest>
  }

  /**
   * Checks whether this editor can handle the given `request`.
   * @param request the request to handle.
   */
  abstract canHandle(request: OpenRequest): boolean | Promise<boolean>

  async handle(request: OpenRequest): Promise<Editor | undefined> {
    if (await this.canHandle(request)) {
      this.request.next(request)
      return this
    }
  }

  equals(o: any): boolean {
    if (!(o instanceof Editor)) {
      return false
    }
    return o.id === this.id
  }
}

/**
 * Represents an editor group.
 *
 * An editor group is a container for editors. It is responsible for opening and closing editors.
 * A group can contains only one active editor at a time and on instance of a resource.
 */
export class EditorGroup {
  private static NEXT_ID = 0
  private fileService?: FileService
  private _tabs: EditorTab[] = []
  private _request?: OpenRequest
  private _history: EditorTab[] = []
  private _activeIndex = 0
  private _activeEditor?: Editor

  /** Unique identifier of this group. */
  readonly id: string = 'editor-group#' + ++EditorGroup.NEXT_ID

  get isEmpty(): boolean {
    return this._tabs.length === 0
  }

  /** Tabs of the group. */
  get tabs(): EditorTab[] {
    return this._tabs
  }

  /** Gets the index of the current active editor. */
  get activeIndex(): number {
    return this._activeIndex
  }

  /** Sets the index of the current active editor. */
  set activeIndex(index: number) {
    if (index === this._activeIndex) {
      return
    }

    if (this._tabs[index]) {
      this._activeIndex = index
      const { resource, options } = this._tabs[index]
      this.open(resource, options)
    }
  }

  /** Tab of the current active editor. */
  get activeTab(): EditorTab | undefined {
    return this._tabs[this._activeIndex]
  }

  /** Current active editor. */
  get activeEditor(): Editor | undefined {
    return this._activeEditor
  }

  /** Current active resource. */
  get activeResource(): monaco.Uri | undefined {
    return this._request ? this._request.uri : undefined
  }

  /**
   * Gets a value indicating whether the current active resource is in a preview mode.
   */
  get isInPreviewMode(): boolean {
    return !!this._request && !!this._request.options.preview
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
    private readonly editors: ReadonlyArray<Editor>
  ) {}

  /**
   * Checks whether the resource is opened in the group, in an editor or as a preview.
   * @param resource the resource.
   * @throws {ReferenceError} if any of the arguments is null.
   */
  contains(resource: monaco.Uri): boolean {
    return !!this.findTab(resource)
  }

  /**
   * Checks whether the resource is opened in the group as a preview.
   * @param resource the resource.
   * @throws {ReferenceError} if any of the arguments is null.
   */
  containsPreview(resource: monaco.Uri): boolean {
    return !!this.findTab(resource, 'preview')
  }

  /**
   * Checks if the given resource is currently active.
   * @param resource the resource.
   * @throws {ReferenceError} if any of the arguments is null.
   */
  isActive(resource: monaco.Uri): boolean {
    return !!this.activeResource && sameResource(this.activeResource, resource)
  }

  /**
   * Gets th index of the given resource inside the group.
   * @param resource the resource to check the index for.
   * @returns The index of the resource or `-1` if the resource is not opened.
   */
  findIndex(resource: monaco.Uri): number {
    return this._tabs.findIndex((tab) => sameResource(tab.resource, resource))
  }

  /**
   * Finds the tab showing the given resource inside the group.
   * @param resource the resource.
   * @param kind restricts the search to the editor or the preview tab of the resource, any of them matches when omitted.
   * @returns The tab or `undefined` if the resource is not opened.
   */
  findTab(resource: monaco.Uri, kind?: EditorTabKind): EditorTab | undefined {
    return this._tabs.find((tab) => sameResource(tab.resource, resource) && (!kind || tab.kind === kind))
  }

  /**
   * Add an editor tab for the given resource inside the group.
   *
   * Note :
   * A resource can have one editor tab and one preview tab in the group, an existing tab of the same kind is reused.
   *
   * @param resource the resource to open.
   * @param options options to pass to the editor that will open the resource.
   * @throws {ReferenceError} if any of the arguments is null.
   * @returns An promise that resolve once the resource is opened.
   */
  async open(resource: monaco.Uri, options: OpenOptions): Promise<void> {
    const kind: EditorTabKind = options.preview ? 'preview' : 'editor'
    // A preview is rendered again on each open, an editor already displayed is left as is.
    // The displayed request is checked, not the active tab: selecting a tab moves the index before opening it.
    const displayed = this._request
    if (kind === 'editor' && displayed && !displayed.options.preview && sameResource(displayed.uri, resource)) return

    this.fileService = this.fileService || this.injector.get(FileService)

    let file: IFile | undefined
    if (this.fileService.hasProvider(resource.scheme)) {
      file = await this.fileService.find(resource)
      if (!file) {
        throw new Error(`File not found "${resource}"`)
      }
    }

    const request = new OpenRequest(resource, this.injector, options, file)

    let editor: Editor | undefined
    for (let i = 0; i < this.editors.length; i++) {
      editor = await this.editors[i].handle(request)
      if (editor) break
    }

    if (!editor) {
      throw new Error(`There is no registered editor to open "${request.uri}"`)
    }

    let tab = this.findTab(resource, kind)
    if (!tab) {
      tab = { kind, options, resource, file }
      this._tabs.push(tab)
    }

    this._request = request
    this._activeIndex = this._tabs.indexOf(tab)
    this._activeEditor = editor
    this._history.push(tab)

    this.opened(this, editor, resource)
  }

  /**
   * Removes every tab of the resource from the group (its editor and its preview).
   * @param resource the resource to close.
   * @param force When `true`, force close the resource without asking to save dirty files.
   * @throws {ReferenceError} if any of the arguments is null.
   * @returns A promise that resolve with `true` if the resource is removed `false` otherwise.
   */
  async close(resource: monaco.Uri, force?: boolean): Promise<boolean> {
    const tabs = this._tabs.filter((tab) => sameResource(tab.resource, resource))
    if (!tabs.length) return false

    for (const tab of tabs) {
      if (!(await this.closeTab(tab, force))) {
        return false
      }
    }
    return true
  }

  /**
   * Removes a tab from the group if its resource has not changed
   * otherwise ask the user to confirme the closing.
   *
   * Note :
   * A preview tab is always removed.
   *
   * @param tab the tab to close.
   * @param force When `true`, force close the tab without asking to save dirty files.
   * @returns A promise that resolve with `true` if the tab is removed `false` otherwise.
   */
  async closeTab(tab: EditorTab, force?: boolean): Promise<boolean> {
    if (!this._tabs.includes(tab)) return false

    const closeable =
      force || // close if forced
      tab.kind === 'preview' || // preview is always closeable
      (await this.closeGuard(this, tab.resource)) // check if dirty

    const index = this._tabs.indexOf(tab)
    if (!closeable || index === -1) return false

    const activeIndex = this._activeIndex
    const wasActive = activeIndex === index
    this._tabs.splice(index, 1)

    if (this.isEmpty) {
      this._request = undefined
      this._activeIndex = -1
      this._activeEditor = undefined
    } else if (wasActive) {
      // The active tab was closed but others remain: focus the neighbour (the
      // tab that shifted into its place, or the new last one) so the group is
      // never left without a focused editor.
      this._request = undefined
      this._activeIndex = -1
      this._activeEditor = undefined
      const next = this._tabs[Math.min(index, this._tabs.length - 1)]
      await this.open(next.resource, next.options).catch(() => undefined)
    } else if (index < activeIndex) {
      // A background tab before the active one was closed: the active tab shifted left.
      this._activeIndex = activeIndex - 1
    }

    this.closed(this, tab.resource)
    return true
  }

  /**
   * Closes all the resources of the group.
   * @param force When `true`, force close the files without asking to save dirty files.
   * @returns A promise that resolve once the closing succeed or fail.
   */
  async closeAll(force?: boolean): Promise<boolean> {
    while (this._tabs.length) {
      if (!(await this.closeTab(this._tabs[0], force))) {
        return false
      }
    }
    return true
  }

  equals(o: any): boolean {
    if (!(o instanceof EditorGroup)) {
      return false
    }
    return o.id === this.id
  }
}
