import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommandService, EditorGroup, EditorService, EditorTab, FileService, ICommand } from '@mcisse/nge-ide/core';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CodeEditor } from './code-editor/code-editor';
import { MediaEditor } from './media-editor/media-editor';
import { PreviewEditor } from './preview-editor/preview-editor';

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
        private readonly editorService: EditorService,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.editorService.registerEditors(
            new CodeEditor(),
            new MediaEditor(),
            new PreviewEditor(),
        );

        this.subscriptions.push(
            this.editorService.state.pipe(
                map(e => e.activeResource)
            ).subscribe(resource => {
                if (resource) {
                    this.commands = of(this.editorService.listCommands());
                } else {
                    this.commands = of([]);
                }
                this.changeDetectorRef.detectChanges();
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

    trackTab(_: number, item: EditorTab) {
        return item.resource.toString();
    }

    trackGroup(_: number, item: EditorGroup) {
        return item.id;
    }
}
