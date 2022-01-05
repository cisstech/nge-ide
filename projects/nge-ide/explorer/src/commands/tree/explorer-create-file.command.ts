import { Injectable } from '@angular/core';
import { CodIcon } from '@mcisse/nge/ui/icon';
import { ExplorerService } from '../../explorer.service';
import { CommandGroups, IExplorerCommand } from './explorer.command';

export const EXPLORER_COMMAND_CREATE_FILE = 'explorer.commands.file';

@Injectable()
export class ExplorerCommandCreateFile implements IExplorerCommand {
    readonly id = EXPLORER_COMMAND_CREATE_FILE;
    readonly icon = new CodIcon('new-file');
    readonly group = CommandGroups.GROUP_WORKSPACE;
    readonly label = 'Nouveau fichier';

    get enabled(): boolean {
        return this.explorerService.canCreateFile();
    }

    constructor(private readonly explorerService: ExplorerService) {}

    execute(): void {
        this.explorerService.createFile();
    }
}

