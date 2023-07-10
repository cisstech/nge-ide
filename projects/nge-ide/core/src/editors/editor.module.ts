import { NgModule } from '@angular/core';
import { CONTRIBUTION } from '../contributions';
import { EditorCloseAllCommand } from './commands/editor-close-all.command';
import { EditorCloseCommand } from './commands/editor-close-command';
import { EditorPreviewCommand, EditorPreviewReloadCommand } from './commands/editor-preview.command';
import { EditorSaveAllCommand } from './commands/editor-save-all.command';
import { EditorSaveCommand } from './commands/editor-save.command';
import { EditorSplitCommand } from './commands/editor-split.command';
import { EditorContribution } from './editor.contribution';

@NgModule({
  providers: [
    EditorCloseAllCommand,
    EditorCloseCommand,
    EditorSaveAllCommand,
    EditorSaveCommand,
    EditorSplitCommand,
    EditorPreviewCommand,
    EditorPreviewReloadCommand,

    { provide: CONTRIBUTION, multi: true, useClass: EditorContribution },
  ],
})
export class EditorModule {}
