import { Injector } from "@angular/core";
import { CommandService } from '../commands/index';
import { IContribution } from "../contributions";
import { ToolbarButton, ToolbarGroups, ToolbarSeparator, ToolbarSevice } from "../toolbar";
import { EditorCloseAllCommand } from "./commands/editor-close-all.command";
import { EditorCloseCommand } from "./commands/editor-close-command";
import { EditorPreviewCommand } from "./commands/editor-preview.command";
import { EditorSaveAllCommand } from "./commands/editor-save-all.command";
import { EditorSaveCommand } from "./commands/editor-save.command";
import { EditorSplitCommand } from "./commands/editor-split.command";
import { HtmlPreviewHandler, MarkdownPreviewHandler, SvgPreviewHandler } from "./preview";
import { PreviewService } from "./preview.service";


export class EditorContribution implements IContribution {
    readonly id = 'workbench.contrib.editor';

    activate(injector: Injector) {
        const commandService = injector.get(CommandService);
        const toolbarService = injector.get(ToolbarSevice);
        const previewService = injector.get(PreviewService);


        commandService.register(
            EditorCloseAllCommand,
            EditorSplitCommand,
            EditorSaveCommand,
            EditorSaveAllCommand,
            EditorCloseCommand,
            EditorPreviewCommand,
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
            new ToolbarSeparator(ToolbarGroups.FILE, 50),
        );
    }
}
