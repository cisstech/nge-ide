import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditorService, emptySearchForm, FileService, IdeService, IFile, NotificationService, SearchForm, SearchResult, StorageService } from '@mcisse/nge-ide/core';
import { ITree, ITreeAdapter, TreeComponent } from '@mcisse/nge/ui/tree';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ide-sidebar-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewChecked {
    private readonly storageId = 'sidebar.view.search.query';
    private readonly subscriptions: Subscription[] = [];

    readonly adapter: ITreeAdapter<Node> = {
        id: 'search.tree',
        idProvider: node => node.id,
        nameProvider: node => node.label,
        childrenProvider: node => node.children || [],
        isExpandable: node => !!node.children?.length,
        actions: {
            mouse: {
                click: e => {
                    const match = e.node;
                    if (!match)
                        return;

                    if (!match.children) {
                        this.editorService
                            .open(match.resource, {
                                position: {
                                    line: match.lineno || 1,
                                    column: match.label.indexOf(this.form.query) || 0
                                }
                            })
                            .catch(this.notificationService.publishError.bind(this));
                    }
                }
            }
        }
    };

    @ViewChild(TreeComponent, { static: true })
    tree!: ITree<Node>;

    form: Required<SearchForm> = emptySearchForm();
    nodes: Node[] = [];
    pattern?: RegExp;
    searching = false;


    get isEmpty(): boolean {
        return !this.searching && !!this.form.query.length && this.nodes.length === 0
    }

    constructor(
        private readonly ideService: IdeService,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly fileService: FileService,
        private readonly editorService: EditorService,
        private readonly storageService: StorageService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly notificationService: NotificationService,
    ) { }

    async ngOnInit(): Promise<void> {
        this.subscriptions.push(
            this.ideService.onBeforeStop(() => {
                this.saveState();
            })
        );

        this.restoreState();
    }

    ngOnDestroy(): void {
        this.saveState();
        this.subscriptions.forEach(e => e.unsubscribe());
    }

    ngAfterViewChecked(): void {
        const height = this.elementRef.nativeElement.offsetHeight + 'px';
        if (height !== this.adapter.treeHeight) {
            const inputs = '32px * 1';
            const margins = '8px * 4';
            this.adapter.treeHeight = `calc(${height} - ${inputs} - ${margins})`;
        }
    }

    async search(): Promise<void> {
        this.searching = true;
        this.form.query = this.form.query.trim();
        this.changeDetectorRef.markForCheck();

        if (!this.form.query) {
            this.nodes = [];
            this.searching = false;
            this.changeDetectorRef.markForCheck();
            return;
        }

        try {
            this.nodes = (
                await this.fileService.search(this.form)
            ).map(this.createNode.bind(this));
        } catch (error) {
            this.nodes = [];
            this.notificationService.publishError(error);
        } finally {
            this.searching = false;
            this.changeDetectorRef.markForCheck();
        }
    }

    private createNode(result: SearchResult<monaco.Uri>) {
        const id = result.entry.toString();
        return {
            id,
            label: this.fileService.entryName(result.entry),
            resource: result.entry,
            children: result.matches.map((match, index) => {
                return {
                    id: id + '#' + index,
                    label: match.match,
                    lineno: match.lineno,
                    resource: result.entry
                } as Node;
            })
        } as Node;
    }

    private saveState(): void {
        this.storageService.set(this.storageId, this.form).subscribe();
    }

    private restoreState(): void {
        this.storageService.get(this.storageId, this.form).subscribe(form => {
            this.form = form;
            this.search();
        });
    }
}

interface Node {
    id: string;
    label: string;
    lineno?: number;
    resource: monaco.Uri;
    children?: Node[];
}
