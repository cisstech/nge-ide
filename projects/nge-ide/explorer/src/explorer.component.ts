import {
    ChangeDetectionStrategy,
    Component,
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
} from '@mcisse/nge-ide/core';
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
export class ExplorerComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    readonly root = this.explorerService.root;
    readonly adapter = this.explorerService.adapter;

    @ViewChild(TreeComponent, { static: true })
    tree!: TreeComponent<IFile>;

    @ViewChild(NzDropdownMenuComponent, { static: true })
    dropdown!: NzDropdownMenuComponent;

    constructor(
        private readonly ideService: IdeService,
        private readonly editorService: EditorService,
        private readonly storageService: StorageService,
        private readonly explorerService: ExplorerService,
        private readonly contextMenuService: NzContextMenuService,
        private readonly notificationService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.restoreState();

        this.subscriptions.push(
            this.editorService.state.subscribe((state) => {
                const { activeResource } = state;
                if (activeResource) {
                    this.tree.focus(resourceId(activeResource));
                }
            })
        );

        this.subscriptions.push(
            this.ideService.onBeforeStop(() => {
                this.saveState();
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

    //#region CALLED FROM TEMPLATE

    _trackById(_: number, e: any): string {
        return e.id;
    }

    _commands(): Observable<IExplorerCommand[][]> {
        return this.explorerService.findTreeCommands();
    }

    _fileIconOptions(node: ITreeNodeHolder<IFile>): FileIconOptions {
        return {
            alt: node.name,
            isRoot: this.explorerService.isRoot(node.data),
            expanded: this.tree.isExpanded(node),
            isDirectory: node.data.isFolder,
        };
    }

    async _execute(command: IExplorerCommand, event: Event) {
        try {
            event.preventDefault();
            event.stopPropagation();
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
