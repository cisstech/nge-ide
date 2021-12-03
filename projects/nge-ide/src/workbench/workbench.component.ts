import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommandScopes, CommandService, EditorGroup, EditorService, FileChangeType, FileService, ICommand } from '@mcisse/nge-ide/core';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { URI } from 'vscode-uri';
import { CodeEditor } from './code-editor/code-editor';
import { MediaEditor } from './media-editor/media-editor';

@Component({
    selector: 'ide-workbench',
    templateUrl: './workbench.component.html',
    styleUrls: ['./workbench.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkbenchComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    groups: Observable<EditorGroup[]> = this.editorService.editorGroups;
    commands: Observable<ICommand[]> = of([]);

    constructor(
        private readonly fileService: FileService,
        private readonly editorService: EditorService,
        private readonly commandService: CommandService
    ) { }

    ngOnInit(): void {
        this.editorService.registerEditors(
            new CodeEditor(),
            new MediaEditor(),
        );

        this.subscriptions.push(
            this.editorService.state.pipe(
                map(e => e.activeResource)
            ).subscribe(resource => {
                if (resource) {
                    this.commands = this.commandService
                        .findAllByScope(CommandScopes.EDITOR_GROUP)
                        .pipe(map(commands => commands.filter(c => c.enabled)));

                } else {
                    this.commands = of([]);
                }
            })
        );

        this.subscriptions.push(
            this.fileService.onDidChangeFile.subscribe(changes => {
                changes.forEach(change => {
                    if (change.type === FileChangeType.Deleted) {
                        this.editorService.close(change.uri);
                    }
                })
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    isActiveGroup(group: EditorGroup): boolean {
        return this.editorService.isActiveGroup(group);
    }

    setActiveGroup(group: EditorGroup): void {
        this.editorService.setActiveGroup(group);
    }

    trackById(_: number, item: any) {
        return item.id;
    }

    trackByUri(_: number, item: URI) {
        return item.toString();
    }
}
