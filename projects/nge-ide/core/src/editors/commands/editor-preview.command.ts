import { Injectable } from "@angular/core";
import { CodIcon } from "@mcisse/nge/ui/icon";
import { CommandScopes, ICommand } from "../../commands";
import { EditorService } from '../editor.service';

export const EDITOR_PREVIEW_COMMAND = 'editor.commands.preview';

@Injectable()
export class EditorPreviewommand implements ICommand {
    readonly id = EDITOR_PREVIEW_COMMAND;
    readonly icon = new CodIcon('preview');
    readonly label = 'Prévisualiser';
    readonly scope = [CommandScopes.EDITOR_GROUP];

    get enabled(): boolean {
        return true;;
    }

    constructor(
        private readonly editorService: EditorService
    ) { }

    execute() {

    }
}
