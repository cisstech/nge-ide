import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    DndData, EditorService, FileService, FileSystemProviderCapabilities, IdeService,
    IFile, NotificationService, Paths, StorageService
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
import { BehaviorSubject, Subscription } from 'rxjs';
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
    readonly commands = new BehaviorSubject<IExplorerCommand[][]>([]);


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
    ) { }

    ngOnInit(): void {
        this.restoreState();

        this.subscriptions.push(
            this.ideService.onBeforeStop(() => {
                this.saveState();
            })
        );

        this.subscriptions.push(
            this.editorService.state.subscribe((state) => {
                const { activeResource } = state;
                if (activeResource) {
                    const nodeId = activeResource.toString();
                    this.tree.expand(nodeId)
                    this.tree.focus(nodeId);
                }
            })
        );

        this.subscriptions.push(
            this.explorerService.onDidContextMenu.subscribe((e) => {
                this.commands.next(this.explorerService.listCommands());
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

    @HostListener('window:click')
    _closeContextMenu() {
        this.commands.next([]);
    }

    //#region CALLED FROM TEMPLATE

    _trackById(_: number, e: any): string {
        return e.id;
    }

    _iconOptions(node: ITreeNodeHolder<IFile>): FileIconOptions {
        return {
            alt: node.name,
            isRoot: node.level === 0,
            expanded: this.tree.isExpanded(node),
            isDirectory: node.expandable,
        };
    }

    /**
     * Handles drag and drop event by asking a confirmation to the user then :
     * - If 'data.file' exists, the function will save the file on the server to the directory 'data.dst'.
     * - If data.src exists, the function will move the resource 'data.src' to the directory 'data.dst'.
     * @param e the dropped data.
     */
    async _onDropped(e: DndData) {
        const srcPath = e.src || e.file?.name || '';
        const dstPath = e.dst;

        if (srcPath === dstPath) {
            return;
        }

        if (!srcPath) {
            return;
        }

        if (!dstPath) {
            return;
        }

        const srcName = Paths.basename(srcPath);
        const src = this.fileService.find(monaco.Uri.parse(srcPath));
        const dst = this.fileService.find(monaco.Uri.parse(dstPath));

        if (!src || this.fileService.isRoot(src.uri)) {
            return;
        }

        if (!dst || !dst.isFolder || dst.readOnly) {
            return;
        }

        if (e.file && !this.fileService.hasCapability(dst.uri, FileSystemProviderCapabilities.FileUpload)) {
            return;
        }

        if (this.fileService.isParent(src.uri, dst.uri)) {
            return;
        }

        if (this.fileService.isAncestor(dst.uri, src.uri)) {
            return;
        }

        const options = {
            title: `Vous êtes sûr de vouloir déplacer '${srcName}' dans '${Paths.basename(dst.uri.path)}'?`,
            noTitle: 'Annuler',
            okTitle: 'Déplacer',
        };

        try {
            const confirmed = await this.dialogService.confirmAsync(options);
            if (confirmed) {
                await this.fileService.move(src || e.file, dst);
                this.tree.expand(dst);
            }
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
