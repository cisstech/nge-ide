import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    EditorService,
    IdeService,
    IFile,
    resourceId,
    StorageService,
    NotificationService,
    FileService,
    DndData,
    Paths,
    asUri,
    isResourceParent,
    FileSystemProviderCapabilities,
} from '@mcisse/nge-ide/core';
import { DialogService } from '@mcisse/nge/ui/dialog';
import { FileIconOptions } from '@mcisse/nge/ui/icon';
import {
    ITreeNodeHolder,
    ITreeState,
    TreeComponent,
    TreeState
} from '@mcisse/nge/ui/tree';
import {
    NzContextMenuService,
    NzDropdownMenuComponent
} from 'ng-zorro-antd/dropdown';
import { Observable, Subscription } from 'rxjs';
import { IExplorerCommand } from './commands';
import { ExplorerService } from './explorer.service';

@Component({
    selector: 'ide-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerComponent implements OnInit, OnDestroy, AfterViewChecked {
    private readonly subscriptions: Subscription[] = [];

    readonly root = this.explorerService.root;
    readonly adapter = this.explorerService.adapter;

    @ViewChild(TreeComponent, { static: true })
    tree!: TreeComponent<IFile>;

    @ViewChild(NzDropdownMenuComponent, { static: true })
    dropdown!: NzDropdownMenuComponent;

    constructor(
        private readonly ideService: IdeService,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly fileService: FileService,
        private readonly editorService: EditorService,
        private readonly dialogService: DialogService,
        private readonly storageService: StorageService,
        private readonly explorerService: ExplorerService,
        private readonly contextMenuService: NzContextMenuService,
        private readonly notificationService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.restoreState();

        this.subscriptions.push(
            this.ideService.onBeforeStop(() => {
                this.saveState();
            })
        );

        this.subscriptions.push(
            this.editorService.state.subscribe((state) => {
                const { activeResource } = state;
                if (activeResource) {
                    this.tree.expand(resourceId(activeResource))
                    this.tree.focus(resourceId(activeResource));
                }
            })
        );

        this.subscriptions.push(
            this.explorerService.onDidContextMenu.subscribe((e) => {
                this.contextMenuService.create(e.event, this.dropdown);
            })
        );
    }

    ngOnDestroy(): void {
        this.saveState();
        this.subscriptions.forEach((s) => s.unsubscribe());
    }

    ngAfterViewChecked(): void {
        const height = this.elementRef.nativeElement.offsetHeight + 'px';
        if (height !== this.adapter.treeHeight) {
           this.adapter.treeHeight = height;
        }
    }

    //#region CALLED FROM TEMPLATE

    _trackById(_: number, e: any): string {
        return e.id;
    }

    _commands(): Observable<IExplorerCommand[][]> {
        return this.explorerService.findTreeCommands();
    }

    _iconOptions(node: ITreeNodeHolder<IFile>): FileIconOptions {
        return {
            alt: node.name,
            isRoot: node.level === 0,
            expanded: this.tree.isExpanded(node),
            isDirectory: node.expandable,
        };
    }

    _draggable(node: ITreeNodeHolder<IFile>) {
        return !this.fileService.isRoot(node.data.uri);
    }

    _droppable(node: ITreeNodeHolder<IFile>) {
        return node.data.isFolder && !node.data.readOnly;
    }

    /**
     * Handles drag and drop event by asking a confirmation to the user then :
     * - If 'data.file' exists, the function will save the file on the server to the directory 'data.dst'.
     * - If data.src exists, the function will move the resource 'data.src' to the directory 'data.dst'.
     * @param e the dropped data.
     */
    async _onDropped(e: DndData) {
        const srcPath =  e.src || e.file?.name || '';
        const dstPath = e.dst;
        if (srcPath === dstPath) {
            return;
        }

        if (!srcPath)
            return;

        if (!dstPath)
            return;

        const srcName = Paths.basename(srcPath);
        const src = this.fileService.find(asUri(srcPath));
        const dst = this.fileService.find(asUri(dstPath));

        if (!src)
            return;

        if (!dst)
            return;

        if (e.file && !this.fileService.hasCapability(dst.uri, FileSystemProviderCapabilities.FileUpload))
            return false;

        if (src && isResourceParent(src, dst))
            return;

        const options = {
            title: `Vous êtes sûr de vouloir déplacer '${srcName}' dans '${Paths.basename(dst.uri.path)}'?`,
            noTitle: 'Annuler',
            okTitle: 'Déplacer',
        };

        try {
            const confirmed = await this.dialogService.confirmAsync(options);
            if (confirmed) {
                await this.fileService.move(src || e.file , dst);
                this.tree.expand(dst);
            }
        } catch (error) {
            this.notificationService.publishError(error);
        }
    }

    async _executeCommand(command: IExplorerCommand) {
        try {
            await command.execute();
        } catch (error) {
            this.notificationService.publishError(error);
        }
    }

    //#endregion

    private saveState() {
        this.storageService
            .set(this.adapter.id, this.tree.saveState())
            .subscribe();
    }

    private restoreState() {
        this.storageService
            .get<ITreeState>(this.adapter.id, new TreeState())
            .subscribe((state) => {
                this.tree.restoreState(state);
            });
    }
}
