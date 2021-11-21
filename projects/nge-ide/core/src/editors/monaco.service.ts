import { Injectable } from '@angular/core';
import { ACTION_GOTO_LINE, ACTION_INDENT_USING_SPACES, LINK_DETECTOR_CONTRIB } from '@mcisse/nge/monaco';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { URI } from 'vscode-uri';
import { IContribution } from '../contributions';
import { Diagnostic, DiagnosticService, DiagnosticSeverity } from '../diagnostics';
import { compareURI, FileChangeType, FileService, resourceId } from '../files';
import { StatusBarService } from '../status-bar';
import { Paths } from '../utils';
import { SettingsService } from './settings.service';

import IPosition = monaco.IPosition;
import IDisposable = monaco.IDisposable;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

declare type Nullable<T> = T | null | undefined;

interface IEditorHolder {
    editor: IStandaloneCodeEditor;
    disposables: IDisposable[];
}

@Injectable()
export class MonacoService implements IContribution {
    readonly id = 'workbench.contrib.code-editor-service';

    private readonly subscriptions: Subscription[] = [];

    private readonly holders = new Map<string, IEditorHolder>();
    private readonly viewStates = new Map<string, any>();

    private readonly cursor$ = new BehaviorSubject<Nullable<IPosition>>(undefined);
    private readonly activeEditor$ = new BehaviorSubject<Nullable<IStandaloneCodeEditor>>(undefined);
    private readonly activeLanguage$ = new BehaviorSubject<Nullable<string>>(undefined)
    private readonly didFollowLink = new Subject<{ uri: monaco.Uri, link: string }>();

    private setModelMarkers?: any;
    private monacoApiDecorated = false;


    /** Emitted when active editor cursor position change. */
    readonly cursorChange = this.cursor$.asObservable();
    /** Emitted when active editor language change. */
    readonly languageChange = this.activeLanguage$.asObservable();
    /** Emitted when active editor change. */
    readonly activeEditorChange = this.activeEditor$.asObservable();
    /** Emitted when a link is clicked inside the editor */
    readonly onDidFollowLink = this.didFollowLink.asObservable();

    constructor(
        private readonly fileService: FileService,
        private readonly settingsService: SettingsService,
        private readonly statusBarService: StatusBarService,
        private readonly diagnosticService: DiagnosticService,
    ) { }

    activate(): void {
        this.subscriptions.push(
            this.fileService.onDidCloseFile.subscribe(this.disposeModel.bind(this))
        );

        this.subscriptions.push(this.fileService.onDidChangeFile.subscribe(changes => {
            changes.forEach(change => {
                if (change.type === FileChangeType.Deleted) {
                    this.disposeModel(change.uri);
                }
            });
        }));

        this.subscriptions.push(this.settingsService.onDidChange.subscribe(this.updateSettings.bind(this)));

        this.registerStatusBarItems();
    }

    deactivate(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
        monaco.editor.getModels().forEach(model => model.dispose());

        this.holders.clear();
        this.viewStates.clear();

        this.undecorateMonacoEditorApi();
    }

    async open(
        options: {
            uri: monaco.Uri | URI;
            editor: IStandaloneCodeEditor;
            readOnly?: boolean;
        }
    ): Promise<void> {
        const { uri, editor, readOnly } = options;
        let model = editor.getModel();
        if (model && compareURI(uri, model.uri)) {
            return; // already opened
        }

        const language = this.findLanguage(options.uri);
        const content = await this.fileService.open(uri);

        model = monaco.editor.getModel(uri);
        if (model) {
            monaco.editor.setModelLanguage(model, language);
            if (model.getValue() !== content.current) {
                model.setValue(content.current);
            }
        } else {
            model = monaco.editor.createModel(content.current, language, uri);
        }

        editor.setModel(model);
        editor.updateOptions({ readOnly });

        const viewState = this.viewStates.get(resourceId(uri));
        if (viewState) {
            editor.restoreViewState(viewState);
        }

        editor.focus();

        this.cursor$.next(editor.getPosition());
        this.activeEditor$.next(editor);
        this.activeLanguage$.next(language);
    }

    runAction(id: string): Promise<void> {
        const editor = this.activeEditor$.value;
        if (editor) {
            editor.focus();
            const action = editor.getAction(id);
            if (!action) {
                return Promise.reject('Action Not found');
            }
            action.run();
        }
        return Promise.reject('No active editor');
    }

    findLanguage(uri: monaco.Uri | URI): string {
        const languages = monaco.languages.getLanguages();
        let extension = Paths.extname(uri.path);
        if (!extension) {
            return 'plaintext';
        }
        extension = '.' + extension;
        return languages.find(e => {
            return e.extensions?.includes(extension)
        })?.id || 'plaintext';
    }

    onCreateEditor(editor: IStandaloneCodeEditor): void {
        this.decorateMonacoEditorApi();

        const linkDetector: any = editor.getContribution(LINK_DETECTOR_CONTRIB);
        linkDetector.openerService.open = (uri: monaco.Uri) => {
            this.didFollowLink.next({
                uri,
                link: uri.path,
            });
        };

        const disposables = [linkDetector];

        disposables.push(
            editor.onDidBlurEditorText(() => {
                const model = editor.getModel();
                if (model) {
                    this.viewStates.set(resourceId(model.uri), editor.saveViewState());
                }
            })
        );

        disposables.push(
            editor.onDidFocusEditorText(() => {
                this.activeEditor$.next(editor);
            })
        );

        disposables.push(
            editor.onDidChangeCursorPosition(e => {
                this.onDidChangeCursorPosition(e, editor);
            })
        );

        disposables.push(
            editor.onDidChangeModelLanguage(e => {
                this.activeLanguage$.next(e.newLanguage);
            })
        );

        disposables.push(
            editor.onDidChangeModelContent(e => {
                const uri = editor.getModel()!.uri;
                this.fileService.update(uri, editor.getValue());
            })
        )

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
            if (!editor.getRawOptions().readOnly) {
                const model = editor.getModel()!;
                this.fileService.save(model.uri);
            }
        }, '');

        this.holders.set(editor.getId(), { editor, disposables });

        this.updateSettings();
    }

    onDisposeEditor(editor: IStandaloneCodeEditor): void {
        const activeEditor = this.activeEditor$.value;
        if (activeEditor?.getId() === editor.getId()) {
            this.cursor$.next(null);
            this.activeLanguage$.next(null);
            this.activeEditor$.next(undefined);
        }

        const editorId = editor.getId();
        const holder = this.holders.get(editorId);
        if (!holder) {
            throw new Error('unregistered editor ' + editorId);
        }

        holder.disposables.forEach(e => e.dispose());
        this.holders.delete(editorId);

        editor.dispose();
        monaco.editor.getModels().forEach((model: any) => {
            if (model['_attachedEditorCount'] === 0) {
                model.dispose();
                this.viewStates.delete(model.uri.fsPath);
            }
        });
    }


    private disposeModel(uri: URI): void {
        const model = monaco.editor.getModel(uri);
        model?.dispose();
    }

    private updateSettings(): void {
        const settings = this.settingsService.extract('editor');
        this.holders.forEach(holder => {
            holder.editor.updateOptions(settings);
        });
    }

    private registerStatusBarItems(): void {
        this.statusBarService.register({
            id: 'workbench.status-bar-item.cursor',
            side: 'right',
            priority: 100,
            tooltip: 'Aller à la ligne/colonne',
            content: this.cursorChange.pipe(map(e => {
                if (!e) {
                    return '';
                }
                return `Ln ${e.lineNumber}, Col ${e.column}`;
            })),
            active: this.cursorChange.pipe(map(e => !!e)),
            action: () => {
                this.runAction(ACTION_GOTO_LINE);
            }
        });

        this.statusBarService.register({
            id: 'workbench.status-bar-item.indent',
            side: 'right',
            priority: 10,
            tooltip: "Modifier l'indentation",
            content: this.activeEditorChange.pipe(map(e => {
                const model = e?.getModel();
                if (model) {
                    const options = model.getOptions();
                    const tabSize = options?.tabSize;
                    const useSpaceOrTab = options?.insertSpaces ? 'Espaces' : 'Tabulation';
                    return `${useSpaceOrTab}: ${tabSize}`;
                }
                return '';
            })),
            active: this.activeEditorChange.pipe(map(e => !!e?.getModel())),
            action: () => {
                this.runAction(ACTION_INDENT_USING_SPACES);
            }
        });

        this.statusBarService.register({
            id: 'workbench.status-bar-item.language',
            side: 'right',
            priority: 1,
            tooltip: 'Langage',
            content: this.languageChange.pipe(map(e => e || '')),
            active: this.languageChange.pipe(map(e => !!e)),
        });
    }

    private onDidChangeCursorPosition(
        event: monaco.editor.ICursorPositionChangedEvent,
        editor: monaco.editor.IStandaloneCodeEditor
    ) {
        this.cursor$.next(event.position);
        for (const holder of this.holders.values()) {
            if (holder.editor.getId() !== editor.getId()) {
                const editorModel = editor.getModel();
                const holderModel = holder.editor.getModel();
                if (editorModel && holderModel && holderModel.id === editorModel.id) {
                    holder.editor.setPosition(event.position);
                }
            }
        }
    }

    private decorateMonacoEditorApi(): void {
        if (!this.monacoApiDecorated) {
            this.monacoApiDecorated = true;
            this.decorateSetModelMarkers();
            this.subscriptions.push(

            )
        }
    }

    private undecorateMonacoEditorApi(): void {
        if (this.monacoApiDecorated) {
            this.monacoApiDecorated = false;
            monaco.editor.setModelMarkers = (model, owner, markers) => {
                this.setModelMarkers.call(monaco.editor, model, owner, markers);
            }
            this.setModelMarkers = undefined;
        }
    }

    private decorateSetModelMarkers(): void {
        this.setModelMarkers = monaco.editor.setModelMarkers;
        monaco.editor.setModelMarkers = (model, owner, markers) => {
            this.setModelMarkers.call(monaco.editor, model, owner, markers);

            const severities = {
                [monaco.MarkerSeverity.Error]: DiagnosticSeverity.Error,
                [monaco.MarkerSeverity.Info]: DiagnosticSeverity.Info,
                [monaco.MarkerSeverity.Warning]: DiagnosticSeverity.Error,
                [monaco.MarkerSeverity.Hint]: DiagnosticSeverity.Error,
            };

            this.diagnosticService.setDiagnostics(
                model.uri,
                markers.map(e => {
                    return {
                        message: e.message,
                        severity: severities[e.severity],
                        range: {
                            start: {
                                lineNumber: e.startLineNumber,
                                column: e.startColumn,
                            },
                            end: {
                                lineNumber: e.endLineNumber,
                                column: e.endColumn,
                            }
                        }
                    } as Diagnostic;
                })
            );
        };
    }

}
