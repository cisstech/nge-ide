import { Injectable } from "@angular/core";
import { CodIcon } from "@mcisse/nge/ui/icon";
import { ICommand } from "../../commands";
import { EditorService } from '../editor.service';

export const EDITOR_SPLIT_COMMAND = 'editor.commands.split';

@Injectable()
export class EditorSplitCommand implements ICommand {
    readonly id = EDITOR_SPLIT_COMMAND;
    readonly icon = new CodIcon('split-horizontal');
    readonly label = 'Nouveau groupe';
    get enabled(): boolean {
        return !!this.editorService.activeResource;
    }

    constructor(
        private readonly editorService: EditorService
    ) { }

    execute() {
        if (this.editorService.activeResource) {
            this.editorService.open(this.editorService.activeResource, {
                openToSide: true
            });
        }
    }
}
