import { Injectable, Type } from '@angular/core';
import {
  CommandService,
  EditorService,
  FileService,
  FileSystemProviderCapabilities,
  IContribution,
  IFile,
  NotificationService,
} from '@cisstech/nge-ide/core';
import {
  ITree,
  ITreeAdapter,
  ITreeEdition,
  ITreeKeyAction,
  ITreeMouseAction,
  TreeService,
} from '@cisstech/nge/ui/tree';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IExplorerCommand } from './commands';
import { FileNestingPattern } from './file-nesting/file-nesting';

type ExplorerFile = IFile & {
  parent?: IFile;
  children: IFile[];
};

/**
 * Provides an API to interact with the explorer view tree.
 */
@Injectable()
export class ExplorerService implements IContribution {
  readonly id = 'workbench.contrib.explorer-service';

  private readonly contextMenu = new Subject<ITreeMouseAction<IFile>>();
  private readonly commandRegistry = new BehaviorSubject<IExplorerCommand[]>([]);
  private readonly fileNestingPatternsRegistry = new BehaviorSubject<FileNestingPattern[]>([])

  get fileNestingPatterns(): ReadonlyArray<FileNestingPattern> {
    return this.fileNestingPatternsRegistry.value;
  }


  private clipboardData: IFile[] = [];
  private newFileType: 'file' | 'folder' | undefined;

  readonly root = this.fileService.treeChange

  readonly adapter: ITreeAdapter<IFile> = {
    id: 'explorer.tree',
    idProvider: (node) => this.fileService.entryId(node.uri),
    nameProvider: (node) => this.fileService.entryName(node.uri),
    tooltipProvider(node) {
      return node.uri.authority + node.uri.path;
    },
    childrenProvider: (node) => {
      const o = node as ExplorerFile;
      if (!o.isFolder) {
        return o.children
      } else {
        o.children = []
      }

      const children = (
        this.fileService.findChildren(node) as ExplorerFile[]
      ).map(child => {
        const adapted: ExplorerFile = {
          ...child,
          parent: node,
        }
        return adapted
      });

      const nestedIds: string[] = [];

      try {
        children.forEach(child => {
          const name = this.fileService.entryName(child.uri);

          let match: RegExpMatchArray | undefined;
          let pattern: FileNestingPattern | undefined;
          for (const item of this.fileNestingPatterns) {
            match = name.match(item.parent) as RegExpMatchArray;
            if (match) {
              pattern = item;
              break;
            }
          }


          if (match && pattern) {
            const matchers = pattern.children.map(child => {
              child = match?.length === 2 ? child.replace('${capture}', match![1]) : child;
              return new RegExp(child);
            })

            const nested = children.filter((o) => {
              const childName = this.fileService.entryName(o.uri);
              if (name === childName) {
                return false;
              }
              return matchers.some(regex => childName.match(regex))
            })

            child.children = nested
            nested.forEach(n => {
              nestedIds.push(this.fileService.entryId(n.uri))
            })
          }
        })
      } catch (error) {
        console.error(error)
      }

      const parent = node as ExplorerFile;
      parent.children = children.filter(child => {
        return !nestedIds.includes(this.fileService.entryId(child.uri))
      })
      return parent.children;
    },
    isExpandable: (node) => {
      const o = node as ExplorerFile;
      if (o.isFolder) return true;
      return !!o.children?.length
    },
    onDidEditName: this.onEditNode.bind(this),
    keepStateOnChangeNodes: true,
    enableKeyboardFiltering: false,
    actions: {
      mouse: {
        click: this.onMouseDown.bind(this),
        rightClick: this.onContextMenu.bind(this),
      },
      keys: {
        c: this.onCopy.bind(this),
        v: this.onPaste.bind(this),
        Enter: (e) => {
          if (e.node) {
            this.tree.startEdition(e.node);
          }
        },
      },
    },
  }

  get tree(): ITree<IFile> {
    return this.treeService.get(this.adapter.id) as any;
  }

  get onDidContextMenu(): Observable<ITreeMouseAction<IFile>> {
    return this.contextMenu.asObservable();
  }


  constructor(
    private readonly treeService: TreeService,
    private readonly fileService: FileService,
    private readonly editorService: EditorService,
    private readonly commandService: CommandService,
    private readonly notificationService: NotificationService
  ) { }

  /**
   * Refresh the explorer tree.
   */
  refresh(): void {
    this.fileService.refresh();
  }

  deactivate() {
    this.clipboardData = [];
    this.commandRegistry.next([]);
    this.fileNestingPatternsRegistry.next([])
  }

  registerFileNestingPatterns(...patterns: FileNestingPattern[]): void {
    this.fileNestingPatternsRegistry.next([
      ...this.fileNestingPatternsRegistry.value,
      ...patterns
    ])
    this.fileService.emitTreeChange()
  }

  unregisterFileNestingPatterns(...ids: string[]): void {
    this.fileNestingPatternsRegistry.next([
      ...this.fileNestingPatternsRegistry.value.filter(o => !ids.includes(o.id))
    ])
    this.fileService.emitTreeChange()
  }

  /**
   * Register commands to the explorer view.
   * @param commands The commands to register.
   */
  registerCommands(
    ...commands: (IExplorerCommand | Type<IExplorerCommand>)[]
  ): void {
    this.commandRegistry.next([
      ...this.commandRegistry.value,
      ...commands.map((c) => {
        if (typeof c === 'function') {
          return this.commandService.find<IExplorerCommand>(c);
        }
        return c;
      }),
    ]);
  }

  unregisterCommands(...ids: string[]): void {
    this.commandRegistry.next([
      ...this.commandRegistry.value.filter((o) => !ids.includes(o.id)),
    ]);
  }

  /**
   * List the commands registered to the explorer view.
   * @returns The list of commands grouped by group name.
   */
  listCommands(): IExplorerCommand[][] {
    const commands = this.commandRegistry.value;
    const groups = commands.reduce((rec, next) => {
      rec[next.group] = rec[next.group] || [];
      if (next.enabled) {
        rec[next.group].push(next);
      }
      return rec;
    }, {} as Record<string, IExplorerCommand[]>);
    return Object.keys(groups)
      .sort()
      .map((k) => groups[k])
      .filter((e) => e.length);
  }

  /**
   * List the currently selected files of the explorer view.
   * @returns The list of selected files.
   */
  selections(): IFile[] {
    return this.fileService.normalize(this.tree?.selections() || []);
  }

  /**
   * Gets the currently focused node of the explorer view.
   * @returns The currently focused node.
   */
  focusedNode(): IFile | undefined {
    return this.tree?.focusedNode();
  }

  /**
   * Expand the given node in the explorer view.
   * @param node The node to expand.
   */
  expand(node: IFile): void {
    this.tree?.expand(node);
  }

  /**
   * Expand all nodes in the explorer view.
   */
  expandAll(): void {
    this.tree?.expandAll();
  }

  /**
   * Collapse the given node in the explorer view.
   * @param node The node to collapse.
   */
  collapse(node: IFile): void {
    this.tree?.collapse(node);
  }

  /**
   * Collapse all nodes in the explorer view.
   */
  collapseAll(): void {
    this.tree?.collapseAll();
  }

  /**
   * Tells if the explorer view has a selection.
   * @returns The list of selected nodes.
   */
  hasSelection(): boolean {
    return !!this.tree?.selections()?.length;
  }

  canCopy(): boolean {
    const selections = this.selections();
    if (!selections.length) {
      return false;
    }

    const first = selections[0];
    if (
      !this.fileService.hasCapability(
        first.uri,
        FileSystemProviderCapabilities.FileMove
      )
    ) {
      return false;
    }

    return selections.every((file) => {
      return (
        file.uri.scheme === first.uri.scheme &&
        !this.fileService.isRoot(file.uri)
      );
    });
  }

  copy(): void {
    this.clipboardData = [];
    if (!this.canCopy()) {
      return;
    }

    this.clipboardData = this.selections();
  }

  canPaste(): boolean {
    const focus = this.focusedNode();
    if (!focus) {
      return false;
    }

    if (!this.clipboardData.length) {
      return false;
    }

    const first = this.clipboardData[0];
    if (
      !this.fileService.hasCapability(
        first.uri,
        FileSystemProviderCapabilities.FileMove
      )
    ) {
      return false;
    }

    return (
      first.uri.scheme === focus.uri.scheme && focus.isFolder && !focus.readOnly
    );
  }

  paste(): void {
    if (!this.canPaste()) return;

    this.fileService
      .copy(this.clipboardData, this.focusedNode() as IFile)
      .catch((error) => {
        this.notificationService.publishError(error);
      });
  }

  canDelete(): boolean {
    const selections = this.selections();
    if (!selections.length) return false;

    return selections.every((file) => {
      return (
        !file.readOnly &&
        !this.fileService.isRoot(file.uri) &&
        this.fileService.hasCapability(
          file.uri,
          FileSystemProviderCapabilities.FileDelete
        )
      );
    });
  }

  canCreateFile(): boolean {
    const focus = this.focusedNode();
    if (focus?.readOnly || !focus?.isFolder) {
      return false;
    }
    return this.fileService.hasCapability(
      focus.uri,
      FileSystemProviderCapabilities.FileWrite
    );
  }

  async createFile(): Promise<void> {
    if (!this.canCreateFile()) {
      return;
    }

    this.newFileType = 'file';
    this.tree.startEdition(this.focusedNode() as IFile, true);
  }

  async createFolder(): Promise<void> {
    if (!this.canCreateFile()) {
      return;
    }

    this.newFileType = 'folder';
    this.tree.startEdition(this.focusedNode() as IFile, true);
  }

  canDownload(): boolean {
    return !!this.focusedNode()?.url;
  }

  download(): void {
    if (!this.canDownload()) {
      return;
    }
    window.open(this.focusedNode()!.url!, '_blank');
  }

  canUpload(): boolean {
    const focus = this.focusedNode();
    if (!focus) {
      return false;
    }

    if (
      !this.fileService.hasCapability(
        focus.uri,
        FileSystemProviderCapabilities.FileUpload
      )
    ) {
      return false;
    }

    return focus.isFolder && !focus.readOnly;
  }

  uploadFiles(file: File) {
    if (!this.canUpload()) {
      return;
    }

    this.fileService
      .upload(file, this.focusedNode() as IFile)
      .catch((error) => {
        this.notificationService.publishError(error);
      });
  }

  canEdit(): boolean {
    const focus = this.focusedNode();
    if (!focus) {
      return false;
    }

    if (
      !this.fileService.hasCapability(
        focus.uri,
        FileSystemProviderCapabilities.FileWrite
      )
    ) {
      return false;
    }

    return !focus.readOnly && !this.fileService.isRoot(focus.uri);
  }

  startEdit(): void {
    if (!this.canEdit()) {
      return;
    }
    this.tree?.startEdition(this.focusedNode() as IFile);
  }

  private onCopy(e: ITreeKeyAction<IFile>) {
    const { event } = e;
    if (event.metaKey || event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();
      this.copy();
    }
  }

  private onPaste(e: ITreeKeyAction<IFile>) {
    const { event } = e;
    if (event.metaKey || event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();
      this.paste();
    }
  }

  private onMouseDown(e: ITreeMouseAction<IFile>) {
    const { node } = e;
    if (node && !node.isFolder) {
      this.editorService.open(e.node!.uri).catch((error) => {
        this.notificationService.publishError(error);
      });
    }
  }

  private onContextMenu(e: ITreeMouseAction<IFile>) {
    this.contextMenu.next(e);
  }

  private async onEditNode(e: ITreeEdition<IFile>): Promise<void> {
    const { node, text, creation } = e;
    try {
      if (creation) {
        if (this.newFileType === 'file') {
          await this.fileService.createFile(node, text);
        } else {
          await this.fileService.createDirectory(node, text);
        }
      } else {
        await this.fileService.rename(node, text);
      }
      this.tree.endEdition();
    } catch (error) {
      this.notificationService.publishError(error);
    }
  }
}
