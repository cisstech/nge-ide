import { Injectable } from '@angular/core';
import {
    CommandScopes,
    CommandService,
    IFile,
    FileService,
    NotificationService,
    EditorService,
    FileSystemProviderCapabilities,
    resourceId
} from '@mcisse/nge-ide/core';
import { DialogService } from '@mcisse/nge/ui/dialog';
import {
    ITree,
    ITreeAdapter,
    ITreeEdition,
    ITreeKeyAction,
    ITreeMouseAction,
    TreeService
} from '@mcisse/nge/ui/tree';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IExplorerCommand } from './commands';

/**
 * Provides an API to interact with the explorer view tree.
 */
@Injectable()
export class ExplorerService {
    private readonly didContextMenu = new Subject<ITreeMouseAction<IFile>>();
    private clipboardData: IFile[] = [];
    private newFileType: 'file' | 'folder' | undefined;

    readonly root = this.fileService.treeChange;
    readonly adapter: ITreeAdapter<IFile> = {
        id: 'explorer.tree',
        idProvider: (node) => resourceId(node.uri),
        nameProvider: (node) => this.fileService.entryName(node),
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
        return this.didContextMenu.asObservable();
    }

    constructor(
        private readonly treeService: TreeService,
        private readonly fileService: FileService,
        private readonly editorService: EditorService,
        private readonly commandService: CommandService,
        private readonly notificationService: NotificationService
    ) { }

    findTreeCommands(): Observable<IExplorerCommand[][]> {
        return this.commandService.findAllByScope<IExplorerCommand>(
            CommandScopes.EXPLORER_TREE
        ).pipe(
            map(commands => {
                const groups = commands.reduce((rec, next) => {
                    rec[next.group] = (rec[next.group] || []);
                    rec[next.group].push(next);
                    return rec;
                }, {} as Record<string, IExplorerCommand[]>);
                return Object
                    .keys(groups)
                    .sort()
                    .map(k => groups[k])
                    .filter(e => e.length);
            })
        );
    }

    findTreeHoverCommands(): Observable<IExplorerCommand[]> {
        return this.commandService.findAllByScope<IExplorerCommand>(
            CommandScopes.EXPLORER_TREE_HOVER
        );
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

    isRoot(file: IFile): boolean {
        return this.fileService.isRoot(file.uri);
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
        ).then(() => {
            this.clipboardData = [];
        }).catch(error => {
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
        return !!this.focusedNode()?.downloadUrl;
    }

    download(): void {
        if (!this.canDownload()) {
            return;
        }

        // TODO support angular universal
        window.open(this.focusedNode()!.downloadUrl!, '_blank');
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

    canSearchIn(): boolean {
        const focus = this.focusedNode();
        if (!focus) {
            return false;
        }

        if (!this.fileService.hasCapability(focus.uri, FileSystemProviderCapabilities.FileSearch)) {
            return false;
        }

        return focus.isFolder;
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
        this.didContextMenu.next(e);
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
