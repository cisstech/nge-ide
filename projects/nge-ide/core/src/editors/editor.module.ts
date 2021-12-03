import { Injector, NgModule } from "@angular/core";
import { CommandService } from '../commands';
import { CONTRIBUTION, IContribution } from "../contributions";
import { ToolbarButton, ToolbarGroups, ToolbarSeparator, ToolbarSevice } from "../toolbar";
import { EditorCloseAllCommand } from "./commands/editor-close-all.command";
import { EditorCloseCommand } from "./commands/editor-close-command";
import { EditorPreviewommand } from "./commands/editor-preview.command";
import { EditorSaveAllCommand } from "./commands/editor-save-all.command";
import { EditorSaveCommand } from "./commands/editor-save.command";
import { EditorSplitCommand } from "./commands/editor-split.command";


class EditorContribution implements IContribution {
    readonly id = 'workbench.contrib.editor';

    activate(injector: Injector) {
        const commandService = injector.get(CommandService);
        const toolbarService = injector.get(ToolbarSevice);

        commandService.register(
            EditorCloseAllCommand,
            EditorSplitCommand,
            EditorPreviewommand,
            EditorSaveCommand,
            EditorSaveAllCommand,
            EditorCloseCommand,
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
            new ToolbarSeparator(ToolbarGroups.FILE, 50),
        );
    }
}


@NgModule({
    providers: [
        EditorCloseAllCommand,
        EditorCloseCommand,
        EditorSaveAllCommand,
        EditorSaveCommand,
        EditorSplitCommand,
        EditorPreviewommand,

        { provide: CONTRIBUTION, multi: true, useClass: EditorContribution }
    ]
})
export class EditorModule { }
