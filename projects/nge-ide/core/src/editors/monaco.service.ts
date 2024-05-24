import { Injectable } from '@angular/core';
import {
  ACTION_ADD_SELECTION_TO_NEXT_FIND_MATCH,
  ACTION_ADD_SELECTION_TO_PREVIOUS_FIND_MATCH,
  ACTION_BLOCK_COMMENT,
  ACTION_COMMENT_LINE,
  ACTION_COPY_LINES_DOWN,
  ACTION_COPY_LINES_UP,
  ACTION_CURSOR_REDO,
  ACTION_CURSOR_UNDO,
  ACTION_DUPLICATE_SELECTION,
  ACTION_EDITOR_FOLD_ALL,
  ACTION_EDITOR_UNFOLD_ALL,
  ACTION_FIND,
  ACTION_GOTO_LINE,
  ACTION_INDENT_USING_SPACES,
  ACTION_INSERT_CURSOR_ABOVE,
  ACTION_INSERT_CURSOR_AT_END_OF_EACH_LINE_SELECTED,
  ACTION_INSERT_CURSOR_BELOW,
  ACTION_JUMP_TO_BRACKET,
  ACTION_MARKER_NEXT,
  ACTION_MARKER_PREV,
  ACTION_MOVE_LINES_DOWN,
  ACTION_MOVE_LINES_UP,
  ACTION_QUICK_COMMAND,
  ACTION_SMART_SELECT_EXPAND,
  ACTION_SMART_SELECT_SHRINK,
  ACTION_START_FIND_REPLACE,
  LINK_DETECTOR_CONTRIB,
} from '@cisstech/nge/monaco';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommand } from '../commands/index';
import { IContribution } from '../contributions/index';
import {
  Diagnostic,
  DiagnosticService,
  DiagnosticSeverity,
} from '../diagnostics/index';
import { FileChangeType, FileService, IFile } from '../files/index';
import { SettingsService } from '../settings/index';
import { StatusBarService } from '../status-bar/index';
import {
  ToolbarButton,
  ToolbarGroups,
  ToolbarSeparator,
  ToolbarService,
} from '../toolbar/index';
import { Paths } from '../utils/index';
import { EditorService } from './editor.service';

// @ts-ignore
// import { MenuRegistry } from 'monaco-editor/esm/vs/platform/actions/common/actions';
// @ts-ignore
// import { StandaloneCodeEditorServiceImpl } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeServiceImpl.js';

import IPosition = monaco.IPosition;
import IDisposable = monaco.IDisposable;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor;

declare type Nullable<T> = T | null | undefined;

interface IEditorHolder {
  editor: IStandaloneCodeEditor;
  disposables: IDisposable[];
}

interface IResourceInput {
  resource: monaco.Uri;
  options?: {
    selection: monaco.IRange;
    selectionRevealType?: number;
  };
}

@Injectable()
export class MonacoService implements IContribution {
  readonly id = 'workbench.contrib.code-editor-service';

  private readonly subscriptions: Subscription[] = [];

  private readonly holders = new Map<string, IEditorHolder>();
  private readonly viewStates = new Map<string, any>();

  private readonly cursor$ = new BehaviorSubject<Nullable<IPosition>>(
    undefined
  );
  private readonly activeEditor$ = new BehaviorSubject<
    Nullable<IStandaloneCodeEditor>
  >(undefined);
  private readonly activeLanguage$ = new BehaviorSubject<Nullable<string>>(
    undefined
  );

  private readonly didFollowLink = new Subject<{ uri: monaco.Uri;  link: string; }>();
  private readonly didCreateEditor = new Subject<IStandaloneCodeEditor>();

  private setModelMarkers?: any;
  private monacoApiDecorated = false;

  /** Emitted when active editor cursor position change. */
  readonly cursorChange = this.cursor$.asObservable();

  /** Emitted when active editor change. */
  readonly activeEditorChange = this.activeEditor$.asObservable();

  /** Emitted when active editor language change. */
  readonly activeLangageChange = this.activeLanguage$.asObservable();

  /** Emitted when a link is clicked inside the editor */
  readonly onDidFollowLink = this.didFollowLink.asObservable();

  /** Emitted when a new editor is created */
  readonly onDidCreateEditor = this.didCreateEditor.asObservable();


  get cursor(): Nullable<IPosition> {
    return this.cursor$.value;
  }

  get activeEditor(): Nullable<IStandaloneCodeEditor> {
    return this.activeEditor$.value;
  }

  get activeLanguage(): Nullable<string> {
    return this.activeLanguage$.value;
  }

  constructor(
    private readonly fileService: FileService,
    private readonly editorService: EditorService,
    private readonly toolbarService: ToolbarService,
    private readonly settingsService: SettingsService,
    private readonly statusBarService: StatusBarService,
    private readonly diagnosticService: DiagnosticService
  ) {}

  async activate(): Promise<void> {
    await this.registerToolbarItems();
    this.registerStatusBarItems();
    this.registerEditorShortcuts();

    this.subscriptions.push(
      this.fileService.onDidCloseFile.subscribe(this.disposeModel.bind(this))
    );

    this.subscriptions.push(
      this.fileService.onDidChangeFile.subscribe((changes) => {
        changes.forEach((change) => {
          if (change.type === FileChangeType.Deleted) {
            this.disposeModel(change.uri);
          }
        });
      })
    );

    this.subscriptions.push(
      this.settingsService.onDidChange.subscribe(this.updateSettings.bind(this))
    );
  }

  deactivate(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions.splice(0, this.subscriptions.length);
    monaco.editor.getModels().forEach((model) => model.dispose());

    this.holders.clear();
    this.viewStates.clear();

    this.undecorateMonacoEditorApi();
  }

  async open(options: {
    file: IFile;
    editor: IStandaloneCodeEditor;
    position?: {
      line: number;
      column: number;
    };
  }): Promise<void> {
    const { file, editor, position } = options;
    const uri = file.uri.with({ fragment: '', query: '' });

    let model = editor.getModel();
    if (model && this.fileService.entryId(uri) === this.fileService.entryId(model.uri)) {
      return; // already opened
    }

    const language = this.findLanguage(uri);
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
    editor.updateOptions({ readOnly: file.readOnly });

    const viewState = this.viewStates.get(uri.with({ query: '' }).toString(true));
    if (viewState) {
      editor.restoreViewState(viewState);
    }

    editor.focus();

    if (position) {
      editor.setPosition({
        lineNumber: position.line,
        column: position.column,
      });
      editor.revealLineInCenter(position.line, monaco.editor.ScrollType.Smooth);
    }

    this.cursor$.next(editor.getPosition());
    this.activeEditor$.next(editor);
    this.activeLanguage$.next(language);
  }

  findLanguage(uri: monaco.Uri): string {
    const languages = monaco.languages.getLanguages();
    let extension = Paths.extname(uri.path);
    if (!extension) {
      return 'plaintext';
    }
    extension = '.' + extension;
    return (
      languages.find((e) => {
        return e.extensions?.includes(extension);
      })?.id || 'plaintext'
    );
  }

  onCreateEditor(editor: IStandaloneCodeEditor): void {
    this.decorateMonacoEditorApi();

    const linkDetector = editor.getContribution(LINK_DETECTOR_CONTRIB) as any;

    const openBase = linkDetector.openerService.open;
    linkDetector.openerService.open = async (
      uri: monaco.Uri,
      options?: { openToSide?: boolean }
    ) => {
      const opened = await openBase.call(
        linkDetector.openerService,
        uri,
        options
      );
      if (!opened) {
        this.didFollowLink.next({ uri, link: uri.path });
      }
    };

    const editorService = (editor as any)._codeEditorService;
    const openEditorBase = editorService.openCodeEditor.bind(editorService);
    editorService.openCodeEditor = async (
      input: IResourceInput,
      source: IStandaloneCodeEditor,
      sideBySide?: boolean
    ) => {
      const result: IStandaloneCodeEditor | undefined = await openEditorBase(
        input,
        source
      );
      if (result == null) {
        let position = undefined;
        if (input.options?.selection) {
          position = {
            line: input.options.selection.startLineNumber,
            column: input.options.selection.startColumn,
          };
        }

        await this.editorService.open(input.resource, {
          position,
          openToSide: sideBySide,
        });
      }
      return result; // always return the base result
    };

    this.holders.set(editor.getId(), {
      editor,
      disposables: [
        linkDetector,
        editor.onDidBlurEditorText(() => {
          const model = editor.getModel();
          if (model) {
            this.viewStates.set(
              model.uri.with({ query: '' }).toString(true),
              editor.saveViewState()
            );
          }
        }),
        editor.onDidFocusEditorText(() => {
          this.activeEditor$.next(editor);
        }),
        editor.onDidChangeCursorPosition((e) => {
          this.onDidChangeCursorPosition(e, editor);
        }),
        editor.onDidChangeModelLanguage((e) => {
          this.activeLanguage$.next(e.newLanguage);
        }),
        editor.onDidChangeModelContent((e) => {
          const uri = editor.getModel()!.uri;
          this.fileService.update(uri, editor.getValue());
        }),
      ],
    });

    this.updateSettings();

    this.didCreateEditor.next(editor);
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

    holder.disposables.forEach((e) => e.dispose());
    this.holders.delete(editorId);

    editor.dispose();
    monaco.editor.getModels().forEach((model: any) => {
      if (model['_attachedEditorCount'] === 0) {
        model.dispose();
        this.viewStates.delete(model.uri.fsPath);
      }
    });
  }

  private disposeModel(uri: monaco.Uri): void {
    const model = monaco.editor.getModel(uri);
    model?.dispose();
  }

  private updateSettings(): void {
    const settings = this.settingsService.extract('editor');
    this.holders.forEach((holder) => {
      holder.editor.updateOptions(settings);
    });
  }

  private registerStatusBarItems(): void {
    this.statusBarService.register({
      id: 'workbench.status-bar-item.cursor',
      side: 'right',
      priority: 100,
      tooltip: 'Aller à la ligne/colonne',
      content: this.cursorChange.pipe(
        map((e) => {
          if (!e) {
            return '';
          }
          return `Ln ${e.lineNumber}, Col ${e.column}`;
        })
      ),
      active: this.cursorChange.pipe(map((e) => !!e)),
      action: () => {
        const editor = this.activeEditor$.value;
        if (editor) {
          editor.focus();
          editor.trigger('code', ACTION_GOTO_LINE, null);
        }
      },
    });

    this.statusBarService.register({
      id: 'workbench.status-bar-item.indent',
      side: 'right',
      priority: 10,
      tooltip: "Modifier l'indentation",
      content: this.activeEditorChange.pipe(
        map((e) => {
          const model = e?.getModel();
          if (model) {
            const options = model.getOptions();
            const tabSize = options?.tabSize;
            const useSpaceOrTab = options?.insertSpaces
              ? 'Espaces'
              : 'Tabulation';
            return `${useSpaceOrTab}: ${tabSize}`;
          }
          return '';
        })
      ),
      active: this.activeEditorChange.pipe(map((e) => !!e?.getModel())),
      action: () => {
        const editor = this.activeEditor$.value;
        if (editor) {
          editor.focus();
          editor.trigger('code', ACTION_INDENT_USING_SPACES, null);
        }
      },
    });

    this.statusBarService.register({
      id: 'workbench.status-bar-item.language',
      side: 'right',
      priority: 1,
      tooltip: 'Langage',
      content: this.activeLangageChange.pipe(map((e) => e || '')),
      active: this.activeLangageChange.pipe(map((e) => !!e)),
    });
  }

  private registerEditorShortcuts() {
    monaco.editor.addKeybindingRule({
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      command: null, 
      when: null,
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
    }
  }

  private undecorateMonacoEditorApi(): void {
    if (this.monacoApiDecorated) {
      this.monacoApiDecorated = false;
      monaco.editor.setModelMarkers = (model, owner, markers) => {
        this.setModelMarkers.call(monaco.editor, model, owner, markers);
      };
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
        markers.map((e) => {
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
              },
            },
          } as Diagnostic;
        })
      );
    };
  }

  private async registerToolbarItems(): Promise<void> {
    // create dummy editor
    const n = document.createElement('div');
    const e = monaco.editor.create(n);
    e.focus();

    const {
      // _themeService,
      // _commandService,
      // _instantiationService,
      // _contextKeyService,
      // _codeEditorService,
      // _standaloneThemeService,
      _standaloneKeybindingService,
    } = e as any;
    const registerEditorAction = (
      action: string,
      group: ToolbarGroups,
      priority: number,
      separator?: boolean
    ) => {
      const editorService = this;
      this.toolbarService.register({
        group,
        priority,
        isSeparator: false,
        command: new (class implements ICommand {
          readonly id = action;
          readonly label = e.getAction(action)?.label || '';
          get keybinding() {
            const lookup = _standaloneKeybindingService._cachedResolver?._lookupMap
              ?? _standaloneKeybindingService._getResolver()._lookupMap;
            return lookup
              ?.get(action)?.[0]
              ?.resolvedKeybinding?.getLabel();
          }

          get enabled() {
            return !!editorService.activeEditor;
          }

          execute() {
            const editor = editorService.activeEditor;
            if (editor) {
              editor.focus();
              editor.trigger('code', action, null);
            }
          }
        })(),
      });

      if (separator) {
        this.toolbarService.register(new ToolbarSeparator(group, priority));
      }
    };

    const registerOptionAction = (
      id: string,
      label: string,
      run: () => void
    ) => {
      this.toolbarService.register(
        new ToolbarButton({
          group: ToolbarGroups.VIEW,
          priority: 100,
          command: new (class implements ICommand {
            readonly id = id;
            readonly label = label;
            readonly enabled = true;
            execute() {
              run();
            }
          })(),
        })
      );
    };

    // EDIT
    registerEditorAction(ACTION_CURSOR_UNDO, ToolbarGroups.EDIT, 10);
    registerEditorAction(ACTION_CURSOR_REDO, ToolbarGroups.EDIT, 10, true);

    registerEditorAction(ACTION_FIND, ToolbarGroups.EDIT, 20);
    registerEditorAction(
      ACTION_START_FIND_REPLACE,
      ToolbarGroups.EDIT,
      20,
      true
    );

    registerEditorAction(ACTION_COMMENT_LINE, ToolbarGroups.EDIT, 20);
    registerEditorAction(ACTION_BLOCK_COMMENT, ToolbarGroups.EDIT, 20, true);

    // SELECTION
    registerEditorAction(
      ACTION_SMART_SELECT_EXPAND,
      ToolbarGroups.SELECTION,
      10
    );
    registerEditorAction(
      ACTION_SMART_SELECT_SHRINK,
      ToolbarGroups.SELECTION,
      10,
      true
    );

    registerEditorAction(ACTION_EDITOR_FOLD_ALL, ToolbarGroups.SELECTION, 20);
    registerEditorAction(
      ACTION_EDITOR_UNFOLD_ALL,
      ToolbarGroups.SELECTION,
      20,
      true
    );

    registerEditorAction(ACTION_COPY_LINES_UP, ToolbarGroups.SELECTION, 30);
    registerEditorAction(ACTION_COPY_LINES_DOWN, ToolbarGroups.SELECTION, 30);
    registerEditorAction(ACTION_MOVE_LINES_UP, ToolbarGroups.SELECTION, 30);
    registerEditorAction(ACTION_MOVE_LINES_DOWN, ToolbarGroups.SELECTION, 30);
    registerEditorAction(
      ACTION_DUPLICATE_SELECTION,
      ToolbarGroups.SELECTION,
      30,
      true
    );

    registerEditorAction(
      ACTION_INSERT_CURSOR_ABOVE,
      ToolbarGroups.SELECTION,
      40
    );
    registerEditorAction(
      ACTION_INSERT_CURSOR_BELOW,
      ToolbarGroups.SELECTION,
      40
    );
    registerEditorAction(
      ACTION_INSERT_CURSOR_AT_END_OF_EACH_LINE_SELECTED,
      ToolbarGroups.SELECTION,
      40
    );
    registerEditorAction(
      ACTION_ADD_SELECTION_TO_NEXT_FIND_MATCH,
      ToolbarGroups.SELECTION,
      40
    );
    registerEditorAction(
      ACTION_ADD_SELECTION_TO_PREVIOUS_FIND_MATCH,
      ToolbarGroups.SELECTION,
      40,
      true
    );

    // SELECTION
    registerEditorAction(ACTION_QUICK_COMMAND, ToolbarGroups.VIEW, 10, true);

    registerOptionAction(
      'view.toggle-minimap',
      'Afficher/Cacher le minimap',
      () => {
        const s = this.settingsService.get(
          'editor.minimap',
          'minimap.enabled'
        ) as any;
        this.settingsService.set('editor.minimap', 'minimap.enabled', !s.value);
      }
    );

    registerOptionAction(
      'view.renderWhitespace',
      'Afficher/Cacher les espaces',
      () => {
        const s = this.settingsService.get('editor', 'renderWhitespace') as any;
        this.settingsService.set('editor', 'renderWhitespace', !s.value);
      }
    );

    registerOptionAction(
      'view.renderControlCharacters',
      'Afficher/Cacher les caractères de contrôle',
      () => {
        const s = this.settingsService.get(
          'editor',
          'renderControlCharacters'
        ) as any;
        this.settingsService.set('editor', 'renderControlCharacters', !s.value);
      }
    );

    // GO
    registerEditorAction(ACTION_GOTO_LINE, ToolbarGroups.GO, 20);
    registerEditorAction(ACTION_JUMP_TO_BRACKET, ToolbarGroups.GO, 20, true);
    registerEditorAction(ACTION_MARKER_NEXT, ToolbarGroups.GO, 30);
    registerEditorAction(ACTION_MARKER_PREV, ToolbarGroups.GO, 30, true);
   
    n.remove();
    e.dispose();
  }
}
