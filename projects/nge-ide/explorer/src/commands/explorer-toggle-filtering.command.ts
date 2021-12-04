import { Injectable } from "@angular/core";
import { CommandScopes } from "@mcisse/nge-ide/core";
import { CodIcon, Icon } from "@mcisse/nge/ui/icon";
import { ExplorerService } from "../explorer.service";
import { CommandGroups, IExplorerCommand } from "./explorer.command";

export const EXPLORER_COMMAND_TOGGLE_FILTERING = 'explorer.commands.toggle-filtering';

@Injectable()
export class ExplorerCommandToggleFiltering implements IExplorerCommand {
    readonly id = EXPLORER_COMMAND_TOGGLE_FILTERING;
    readonly group = CommandGroups.GROUP_MODIFICATION;
    readonly scope = [CommandScopes.EXPLORER_TITLE_BAR];
    readonly enabled = true;

    get icon(): Icon {
        return this.explorerService.adapter.enableKeyboardFiltering ? new CodIcon('list-filter') : new CodIcon('list-selection');
    }

    get label(): string {
        return this.explorerService.adapter.enableKeyboardFiltering ?
            'Désactiver le filtrage du clavier' :
            'Activer le filtrage du clavier (Cliquez sur l\'arborescence et tapez sur le clavier pour filtrer)';
    }

    constructor(
        private readonly explorerService: ExplorerService
    ) {}

    execute() {
        this.explorerService.adapter.enableKeyboardFiltering = !this.explorerService.adapter.enableKeyboardFiltering;
    }
}
