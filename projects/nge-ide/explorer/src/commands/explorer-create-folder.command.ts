import { Injectable } from '@angular/core';
import { CommandScopes } from '@mcisse/nge-ide/core';
import { CodIcon } from '@mcisse/nge/ui/icon';
import { ExplorerService } from '../explorer.service';
import { CommandGroups, IExplorerCommand } from './explorer.command';

export const EXPLORER_COMMAND_CREATE_FOLDER = 'explorer.commands.create-folder';

@Injectable()
export class ExplorerCommandCreateFolder implements IExplorerCommand {
    readonly id = EXPLORER_COMMAND_CREATE_FOLDER;
    readonly icon = new CodIcon('new-folder');
    readonly group = CommandGroups.GROUP_WORKSPACE;
    readonly label = 'Nouveau dossier';
    readonly scope = [CommandScopes.EXPLORER_TREE, CommandScopes.EXPLORER_TREE_HOVER];

    get enabled(): boolean {
        return this.explorerService.canCreateFile();
    }

    constructor(private readonly explorerService: ExplorerService) {}

    execute(): void {
        this.explorerService.createFolder();
    }

}

