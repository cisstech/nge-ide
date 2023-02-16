import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MonacoService,
  Editor,
  OpenOptions,
  OpenRequest,
  NotificationService,
  EditorService,
} from '@cisstech/nge-ide/core';
import { Subscription } from 'rxjs';

import IDisposable = monaco.IDisposable;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;
import IStandaloneDiffEditor = monaco.editor.IStandaloneDiffEditor;

@Component({
  selector: 'ide-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeEditorComponent implements OnInit, OnDestroy {
  private readonly disposables: IDisposable[] = [];
  private readonly subscriptions: Subscription[] = [];

  private request?: OpenRequest;
  private codeEditor!: IStandaloneCodeEditor;
  private diffEditor!: IStandaloneDiffEditor;

  opening = true;

  @Input()
  editor!: Editor;

  get showCodeEditor(): boolean {
    return !this.opening && !this.isDiffMode;
  }

  get showDiffEditor(): boolean {
    return !this.opening && this.isDiffMode;
  }

  private get isDiffMode(): boolean {
    return !!this.request?.options?.diff;
  }

  constructor(
    private readonly monacoService: MonacoService,
    private readonly editorService: EditorService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.editor.onChangeRequest.subscribe((request) => {
        this.request = request;
        this.opening = true;
        this.changeDetectorRef.detectChanges();
        this.handleRequest();
      })
    );

    this.subscriptions.push(
      this.editorService.state.subscribe((_) => {
        this.codeEditor?.layout();
      })
    );
  }

  ngOnDestroy(): void {
    this.disposables.forEach((e) => e.dispose());
    this.subscriptions.forEach((s) => s.unsubscribe());
    if (this.codeEditor) {
      this.monacoService.onDisposeEditor(this.codeEditor);
    }
  }

  onCreateEditor(editor: IStandaloneCodeEditor): void {
    this.monacoService.onCreateEditor((this.codeEditor = editor));
    this.handleRequest();
  }

  onCreateDiffEditor(editor: IStandaloneDiffEditor): void {
    this.diffEditor = editor;
    this.monacoService.onCreateEditor(editor.getModifiedEditor());
    this.handleRequest();
  }

  private async handleRequest(): Promise<void> {
    if (!this.codeEditor || !this.diffEditor || !this.request) {
      return;
    }

    const options = this.request.options || {};

    try {
      await this.monacoService.open({
        uri: this.request.uri,
        editor: this.codeEditor,
        position: options.position,
      });
    } catch (error) {
      this.notificationService.publishError(error);
    } finally {
      this.opening = false;
      this.changeDetectorRef.detectChanges();
    }

    this.handleDiffOptions(options);
  }

  private handleDiffOptions(options: OpenOptions): void {
    if (options.diff) {
      const model = this.codeEditor.getModel()!;
      this.diffEditor.setModel({
        original: monaco.editor.createModel(
          options.diff,
          model.getLanguageId()
        ),
        modified: monaco.editor.createModel(
          model.getValue(),
          model.getLanguageId()
        ),
      });

      this.diffEditor.updateOptions({
        readOnly: this.codeEditor.getRawOptions().readOnly,
      });

      this.diffEditor.getModifiedEditor().focus();
    }
  }
}
