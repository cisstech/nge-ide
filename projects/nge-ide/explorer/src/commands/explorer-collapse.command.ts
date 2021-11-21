import { Injectable } from '@angular/core';
import { CommandScopes, ICommand } from '@mcisse/nge-ide/core';
import { CodIcon } from '@mcisse/nge/ui/icon';
import { ExplorerService } from '../explorer.service';

export const EXPLORER_COMMAND_COLLAPSE = 'explorer.commands.collapse';

@Injectable()
export class ExplorerCommandCollapse implements ICommand {
    readonly id = EXPLORER_COMMAND_COLLAPSE;
    readonly icon = new CodIcon('collapse-all');
    readonly label = 'Réduire les dossiers';
    readonly scope = [CommandScopes.EXPLORER_TITLE_BAR];
    readonly enabled = true;

    constructor(private readonly explorerService: ExplorerService) {}

    execute() {
        this.explorerService.collapseAll();
    }
}
