import { Injectable, Type } from '@angular/core';
import {
    CommandService, EditorService, FileService, FileSystemProviderCapabilities, IContribution, IFile, NotificationService
} from '@mcisse/nge-ide/core';
import {
    ITree,
    ITreeAdapter,
    ITreeEdition,
    ITreeKeyAction,
    ITreeMouseAction,
    TreeService
} from '@mcisse/nge/ui/tree';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IExplorerCommand } from './commands';


/**
 * Provides an API to interact with the explorer view tree.
 */
@Injectable()
export class ExplorerService implements IContribution {
    readonly id = 'workbench.contrib.explorer-service';

    private readonly contextMenu = new Subject<ITreeMouseAction<IFile>>();
    private readonly commandRegistry = new BehaviorSubject<IExplorerCommand[]>([]);

    private clipboardData: IFile[] = [];
    private newFileType: 'file' | 'folder' | undefined;

    readonly root = this.fileService.treeChange;
    readonly adapter: ITreeAdapter<IFile> = {
        id: 'explorer.tree',
        idProvider: (node) => node.uri.toString(),
        nameProvider: (node) => this.fileService.entryName(node.uri),
        childrenProvider: (node) => this.fileService.findChildren(node),
        isExpandable: (node) => node.isFolder,
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
    };

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

    deactivate() {
        this.clipboardData = [];
        this.commandRegistry.next([]);
    }

    registerCommands(...commands: (IExplorerCommand | Type<IExplorerCommand>)[]): void {
        this.commandRegistry.next([
            ...this.commandRegistry.value,
            ...commands.map(c => {
                if (typeof c === 'function') {
                    return this.commandService.find<IExplorerCommand>(c);
                }
                return c;
            }),
        ]);
    }

    listCommands(): IExplorerCommand[][] {
        const commands = this.commandRegistry.value;
        const groups = commands.reduce((rec, next) => {
            rec[next.group] = (rec[next.group] || []);
            if (next.enabled) {
                rec[next.group].push(next);
            }
            return rec;
        }, {} as Record<string, IExplorerCommand[]>);
        return Object
            .keys(groups)
            .sort()
            .map(k => groups[k])
            .filter(e => e.length);
    }

    selections(): IFile[] {
        return this.fileService.normalize(
            (this.tree?.selections() || [])
        );
    }

    focusedNode(): IFile | undefined {
        return this.tree?.focusedNode();
    }

    expand(node: IFile): void {
        this.tree?.expand(node);
    }

    expandAll(): void {
        this.tree?.expandAll();
    }

    collapse(node: IFile): void {
        this.tree?.collapse(node);
    }

    collapseAll(): void {
        this.tree?.collapseAll();
    }

    hasSelection(): boolean {
        return !!this.tree?.selections()?.length;
    }

    canCopy(): boolean {
        const selections = this.selections();
        if (!selections.length) {
            return false;
        }

        const first = selections[0];
        if (!this.fileService.hasCapability(first.uri, FileSystemProviderCapabilities.FileMove)) {
            return false;
        }

        return selections.every(file => {
            return file.uri.scheme === first.uri.scheme && !this.fileService.isRoot(file.uri);
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
        if (!this.fileService.hasCapability(first.uri, FileSystemProviderCapabilities.FileMove)) {
            return false;
        }

        return first.uri.scheme === focus.uri.scheme && focus.isFolder && !focus.readOnly;
    }

    paste(): void {
        if (!this.canPaste())
            return;

        this.fileService.copy(
            this.clipboardData,
            this.focusedNode() as IFile
        ).catch(error => {
            this.notificationService.publishError(error);
        });
    }

    canDelete(): boolean {
        const selections = this.selections();
        if (!selections.length)
            return false;

        return selections.every(file => {
            return !file.readOnly &&
                !this.fileService.isRoot(file.uri) &&
                this.fileService.hasCapability(file.uri, FileSystemProviderCapabilities.FileDelete)
        });
    }

    canCreateFile(): boolean {
        const focus = this.focusedNode();
        if (focus?.readOnly || !focus?.isFolder) {
            return false;
        }
        return this.fileService.hasCapability(focus.uri, FileSystemProviderCapabilities.FileWrite);
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

        // TODO support angular universal
        window.open(this.focusedNode()!.url!, '_blank');
    }

    canUpload(): boolean {
        const focus = this.focusedNode();
        if (!focus) {
            return false;
        }

        if (!this.fileService.hasCapability(focus.uri, FileSystemProviderCapabilities.FileUpload)) {
            return false;
        }

        return focus.isFolder && !focus.readOnly;
    }

    uploadFiles(file: File) {
        if (!this.canUpload()) {
            return;
        }

        this.fileService.upload(
            file,
            this.focusedNode() as IFile
        ).catch(error => {
            this.notificationService.publishError(error);
        });
    }

    canEdit(): boolean {
        const focus = this.focusedNode();
        if (!focus) {
            return false;
        }

        if (!this.fileService.hasCapability(focus.uri, FileSystemProviderCapabilities.FileWrite)) {
            return false;
        }

        return !focus.readOnly && !this.fileService.isRoot(focus.uri);
    }

    startEdit(): void {
        if (!this.canEdit()) {
            return;
        }

        this.tree?.startEdition(
            this.focusedNode() as IFile
        );
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
            this.editorService.open(e.node!.uri).catch(error => {
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
        } catch (error) {
            this.notificationService.publishError(error);
        }
    }
}
