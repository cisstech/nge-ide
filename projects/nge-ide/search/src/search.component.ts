// tslint:disable: no-inferrable-types

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';
import { CommandService } from '@mcisse/nge-ide/core';
import { EditorService } from '@mcisse/nge-ide/core';
import { FileService } from '@mcisse/nge-ide/core';
import { NotificationService } from '@mcisse/nge-ide/core';
import { ViewService } from '@mcisse/nge-ide/core';
import { IdeService } from '@mcisse/nge-ide/core';

@Component({
    selector: 'ide-sidebar-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
    private readonly storageId = 'sidebar.view.search.query';
    private readonly subscriptions: Subscription[] = [];

    /* readonly options: ITreeOptions<TreeNode> = {
        idProvider: node => node.id,
        nameProvider: node => node.name,
        childrenProvider: node => node.children,
        isExpandable: node => node.children && !!node.children.length,
        actions: {
            mouse: {
                click: e => {
                    const match = e.node;
                    if (match.children) {
                        this.tree.toggleNode(match);
                    } else {
                        this.studio
                            .open(match.resource, {
                                position: {
                                    line: match.lineno,
                                    column: match.name.indexOf(this.query) || 0
                                }
                            })
                            .catch(error => {
                                this.notifs.catch(error);
                            });
                    }
                }
            }
        }
    }; */

    query = '';
    empty = true;
    useRegex = false;
    matchWord = false;
    matchCase = false;
    include = '';
    exclude = '';
    pattern?: RegExp;

    // nodes: TreeNode[] = [];

  /*   @ViewChild(TreeComponent, { static: true })
    tree: ITree<TreeNode>;
 */
    constructor(
        private readonly ideService: IdeService,
        private readonly viewService: ViewService,
        private readonly fileService: FileService,
        private readonly editorService: EditorService,
        private readonly commandService: CommandService,
        private readonly notificationService: NotificationService,
        // private readonly storage: StorageService,
    ) {}

    ngOnInit() {
       /*  const state = this.storage.get(this.storageId, {
            query: '',
            include: '',
            exclude: '',
            matchWord: false,
            matchCase: false,
            useRegex: false,
        });

        this.query = state.query;
        this.include = state.include;
        this.exclude = state.exclude;
        this.matchWord = state.matchWord;
        this.matchCase = state.matchCase;
        this.useRegex = state.useRegex;
        */

        this.search();

        this.subscriptions.push(
            this.ideService.onBeforeStop(() => {
                this.saveState();
            })
        );

        /* this.viewService.consumeArgs('sidebar.view.search', args => {
            const { data } = args;
            if (data && data.searchIn) {
                this.include = data.searchIn;
            }
        }); */
    }

    ngOnDestroy(): void {
        this.saveState();
        this.subscriptions.forEach(e => e.unsubscribe());
    }

    async search(): Promise<void> {
        this.query = this.query.trim();
        if (this.query) {
            /* TODO try {
                const response = await this.fs.search({
                    query:  this.query,
                    path: this.include,
                    exclude: this.exclude,
                    matchWord: this.matchWord,
                    matchCase: this.matchCase,
                    useRegex: this.useRegex
                });
                this.nodes = response.map(item => {
                    const { path: path, name } = item.entry;
                    return {
                        name,
                        id: path,
                        resource: item.entry,
                        children: item.matches.map((match, index) => {
                            return {
                                id: path + '#' + index,
                                name: match.match,
                                lineno: match.lineno,
                                resource: item.entry
                            } as TreeNode;
                        })
                    } as TreeNode;
                });
                this.empty = this.nodes.length === 0;
            } catch (error) {
                this.notifs.catch(error);
                this.empty = true;
                this.nodes = [];
            } */
        } else {
            this.empty = true;
            // this.nodes = [];
        }
    }

    private saveState() {
       /*  this.storage.set(this.storageId, {
            query: this.query,
            include: this.include,
            exclude: this.exclude,
            matchCase: !!this.matchCase,
            matchWord: !!this.matchWord,
            useRegex: !!this.useRegex,
        }); */
    }
}

/* interface TreeNode extends ITreeNode {
    id: string;
    name: string;
    lineno?: number;
    resource: TextDocument;
    children: TreeNode[];
} */
