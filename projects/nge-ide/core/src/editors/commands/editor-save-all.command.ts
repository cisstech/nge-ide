import { Injectable } from "@angular/core";
import { CodIcon } from "@mcisse/nge/ui/icon";
import { ICommand, Keybinding } from "../../commands";
import { KeyCodes, KeyModifiers } from "../../keybinding";
import { EditorService } from '../editor.service';

export const EDITOR_SAVE_ALL_COMMAND = 'editor.commands.save-all';

@Injectable()
export class EditorSaveAllCommand implements ICommand {
    readonly id = EDITOR_SAVE_ALL_COMMAND;
    readonly icon = new CodIcon('save-all');
    readonly label = 'Enregistrer tout';
    readonly keybinding = new Keybinding({ key: KeyCodes.S, label: '⌥ ⌘ S', modifiers: [KeyModifiers.CTRL_CMD, KeyModifiers.ALT] });

    get enabled(): boolean {
        return !!this.editorService.activeResource;
    }

    constructor(
        private readonly editorService: EditorService
    ) { }

    execute() {
        if (this.editorService.activeResource) {
            this.editorService.saveAll();
        }
    }
}
