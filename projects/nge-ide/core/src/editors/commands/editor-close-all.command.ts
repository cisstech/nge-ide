import { Injectable } from "@angular/core";
import { CodIcon } from "@mcisse/nge/ui/icon";
import { ICommand, Keybinding } from "../../commands";
import { KeyCodes, KeyModifiers } from "../../keybinding";
import { EditorService } from "../editor.service";

export const EDITOR_CLOSE_COMMAND = 'editor.commands.close-all';

@Injectable()
export class EditorCloseAllCommand implements ICommand {
    readonly id = EDITOR_CLOSE_COMMAND;
    readonly icon = new CodIcon('close-all');
    readonly label = 'Fermer tout';
    readonly keybinding = new Keybinding({ key: KeyCodes.W, label: '⌥ ⌘ W', modifiers: [KeyModifiers.CTRL_CMD, KeyModifiers.ALT] });

    constructor(
        private readonly editorService: EditorService
    ) { }

    get enabled(): boolean {
        return !!this.editorService.activeResource;
    }

    async execute(): Promise<void> {
        this.editorService.closeAll();
    }
}
