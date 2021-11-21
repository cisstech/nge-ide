import { Injectable } from "@angular/core";
import { CommandScopes } from "@mcisse/nge-ide/core";
import { CodIcon } from "@mcisse/nge/ui/icon";
import { ExplorerService } from "../explorer.service";
import { CommandGroups, IExplorerCommand } from "./explorer.command";

export const EXPLORER_COMMAND_RENAME = 'explorer.commands.rename';

@Injectable()
export class ExplorerCommandRename implements IExplorerCommand {
    readonly id = EXPLORER_COMMAND_RENAME;
    readonly icon = new CodIcon('edit');
    readonly group = CommandGroups.GROUP_MODIFICATION;
    readonly label = 'Renommer';
    readonly scope = [CommandScopes.EXPLORER_TREE, CommandScopes.EXPLORER_TREE_HOVER];

    get enabled(): boolean {
        return this.explorerService.canEdit();
    }

    constructor(private readonly explorerService: ExplorerService) {}

    execute() {
        this.explorerService.startEdit();
    }
}
