import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MonacoService, Editor, OpenOptions, OpenRequest, NotificationService } from '@mcisse/nge-ide/core';
import { Subscription } from 'rxjs';

import IDisposable = monaco.IDisposable;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;


@Component({
    selector: 'ide-code-editor',
    templateUrl: './code-editor.component.html',
    styleUrls: ['./code-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorComponent implements OnInit, OnDestroy {
    private readonly disposables: IDisposable[] = [];
    private readonly subscriptions: Subscription[] = [];

    private request?: OpenRequest;
    private codeEditor!: IStandaloneCodeEditor;

    @Input()
    editor!: Editor;

    constructor(
        private readonly monacoService: MonacoService,
        private readonly notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.subscriptions.push(
            this.editor.onChangeRequest.subscribe(request => {
                this.request = request;
                this.handleRequest();
            })
        );
    }

    ngOnDestroy(): void {
        this.disposables.forEach(e => e.dispose());
        this.subscriptions.forEach(s => s.unsubscribe());
        if (this.codeEditor) {
            this.monacoService.onDisposeEditor(this.codeEditor);
        }
    }


    onCreateEditor(editor: IStandaloneCodeEditor): void {
        this.monacoService.onCreateEditor(this.codeEditor = editor);
        this.handleRequest();
    }

    private async handleRequest(): Promise<void> {
        if (!this.codeEditor || !this.request) {
            return;
        }

        const options = (this.request.options || {});

        try {
            await this.monacoService.open({
                uri: this.request.uri,
                editor: this.codeEditor,
            });
        } catch(error) {
            this.notificationService.publishError(error);
        }

        this.handleCodeOptions(options);
        this.handleDiffOptions(options);
    }

    private handleCodeOptions(options: OpenOptions): void {
        const { position } = options;
        if (position) {
            this.codeEditor.setPosition({
                lineNumber: position.line,
                column: position.column
            });
            this.codeEditor.revealLineInCenter(
                position.line,
                monaco.editor.ScrollType.Smooth
            );
        }
    }

    private handleDiffOptions(options: OpenOptions): void {
        // TODO
    }
}
