import { Injectable, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandService } from '../commands/index';
import { IContribution } from '../contributions';
import {
  ToolbarButton,
  ToolbarGroups,
  ToolbarSeparator,
  ToolbarService,
} from '../toolbar';
import { EditorCloseAllCommand } from './commands/editor-close-all.command';
import { EditorCloseCommand } from './commands/editor-close-command';
import { EditorPreviewCommand, EditorPreviewReloadCommand } from './commands/editor-preview.command';
import { EditorSaveAllCommand } from './commands/editor-save-all.command';
import { EditorSaveCommand } from './commands/editor-save.command';
import { EditorSplitCommand } from './commands/editor-split.command';
import { DropIntoEditorController } from './drop-into-editor-controller/drop-into-editor-controller';
import { EditorService } from './editor.service';
import { MonacoService } from './monaco.service';
import {
  HtmlPreviewHandler,
  MarkdownPreviewHandler,
  SvgPreviewHandler,
} from './preview';
import { PreviewService } from './preview.service';

@Injectable()
export class EditorContribution implements IContribution {
  private readonly subscriptions: Subscription[] = [];
  readonly id = 'workbench.contrib.editor';

  activate(injector: Injector) {
    const commandService = injector.get(CommandService);
    const toolbarService = injector.get(ToolbarService);
    const previewService = injector.get(PreviewService);
    const editorService = injector.get(EditorService);
    const monacoService = injector.get(MonacoService);

    commandService.register(
      EditorCloseAllCommand,
      EditorSplitCommand,
      EditorSaveCommand,
      EditorSaveAllCommand,
      EditorCloseCommand,
      EditorPreviewCommand,
      EditorPreviewReloadCommand
    );

    editorService.registerCommands(
      EditorCloseAllCommand,
      EditorSplitCommand,
      EditorPreviewCommand,
      EditorPreviewReloadCommand
    );

    previewService.register(
      new SvgPreviewHandler(),
      new HtmlPreviewHandler(),
      new MarkdownPreviewHandler()
    );

    toolbarService.register(
      new ToolbarButton({
        group: ToolbarGroups.FILE,
        command: commandService.find(EditorSaveCommand),
        priority: 40,
      }),

      new ToolbarButton({
        group: ToolbarGroups.FILE,
        command: commandService.find(EditorSaveAllCommand),
        priority: 40,
      }),
      new ToolbarSeparator(ToolbarGroups.FILE, 40),

      new ToolbarButton({
        group: ToolbarGroups.FILE,
        command: commandService.find(EditorCloseCommand),
        priority: 50,
      }),

      new ToolbarButton({
        group: ToolbarGroups.FILE,
        command: commandService.find(EditorCloseAllCommand),
        priority: 50,
      }),
      new ToolbarSeparator(ToolbarGroups.FILE, 50)
    );

    this.subscriptions.push(
      monacoService.onDidCreateEditor.subscribe((editor) => {
        new DropIntoEditorController(editor, editorService);
      })
    )

  }

  deactivate(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
