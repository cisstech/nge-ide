import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Diagnostic, DiagnosticGroup, DiagnosticService, DiagnosticSeverity, EditorService, NotificationService } from '@mcisse/nge-ide/core';
import { ITree, ITreeAdapter, TreeComponent } from '@mcisse/nge/ui/tree';
import { Subscription } from 'rxjs';
import { URI } from 'vscode-uri';

@Component({
    selector: 'ide-problems',
    templateUrl: 'problems.component.html',
    styleUrls: ['./problems.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemsComponent implements OnInit, OnDestroy, AfterViewChecked {
    private readonly subscriptions: Subscription[] = [];

    readonly adapter: ITreeAdapter<TreeNode> = {
        id: 'problems.tree',
        idProvider: node => node.id,
        nameProvider: node => node.name,
        isExpandable: node => !!node.children?.length,
        childrenProvider: node => node.children || [],
        actions: {
            mouse: {
                click: e => {
                    const node = e.node as TreeNode;
                    if (node.diagnostic) {
                        this.editorService.open(URI.parse(node.uri), {
                            position: {
                                line: node.lineNumber || 1,
                                column: node.column || 0
                            }
                        }).catch(this.notificationService.publishError.bind(this));
                    }
                }
            }
        }
    };

    @ViewChild(TreeComponent, { static: true })
    tree!: ITree<TreeNode>;

    nodes: TreeNode[] = [];

    constructor(
        private readonly editorService: EditorService,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly diagnosticService: DiagnosticService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly notificationService: NotificationService,
    ) { }

    ngOnInit(): void {
        this.subscriptions.push(
            this.diagnosticService.asObservableAll().subscribe(groups => {
                this.nodes = groups.map(this.buildNode.bind(this));
                this.changeDetectorRef.markForCheck();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(e => e.unsubscribe());
    }

    ngAfterViewChecked(): void {
        const height = this.elementRef.nativeElement.offsetHeight + 'px';
        if (height !== this.adapter.treeHeight) {
           this.adapter.treeHeight = height;
        }
    }

    private buildNode(group: DiagnosticGroup): TreeNode {
        return {
            id: group.uri,
            uri: group.uri,
            name: group.uri,
            children: group.diagnostics
                .map((e, i) => {
                    const icons = {
                        [DiagnosticSeverity.Info]: 'codicon codicon-info icon-info',
                        [DiagnosticSeverity.Hint]: 'codicon codicon-info icon-hint',
                        [DiagnosticSeverity.Error]: 'codicon codicon-error icon-error',
                        [DiagnosticSeverity.Warning]: 'codicon codicon-warning icon-info',
                    };
                    return {
                        id: group.uri + '#' + i,
                        uri: group.uri,
                        name: this.truncate(e.message, 100),
                        column: e.range.start.column,
                        tooltip: e.message,
                        iconClass: icons[e.severity],
                        lineNumber: e.range.start.lineNumber,
                        diagnostic: e,
                    } as TreeNode;
                })
                .sort((a, b) => {
                    if (!a.diagnostic) {
                        return -1;
                    }
                    if (!b.diagnostic) {
                        return 1;
                    }
                    return a.diagnostic.severity.localeCompare(b.diagnostic.severity);
                })
        };
    }

    private truncate(text: string, length: number): string {
        if (text.length <= length) {
            return text;
        }
        return text.substr(0, length) + '...';
    }

}

interface TreeNode {
    id: string;
    uri: string;
    name: string;
    column?: number;
    tooltip?: string;
    children?: TreeNode[];
    iconClass?: string;
    lineNumber?: number;
    diagnostic?: Diagnostic;
}

