import { Injectable } from '@angular/core';
import { CommandScopes } from '@mcisse/nge-ide/core';
import { FaIcon } from '@mcisse/nge/ui/icon';
import { ExplorerService } from '../explorer.service';
import { CommandGroups, IExplorerCommand } from './explorer.command';

export const EXPLORER_COMMAND_FILE_EXPORT = 'explorer.commands.file-export';

@Injectable()
export class ExplorerCommandFileExport implements IExplorerCommand {
    readonly id = EXPLORER_COMMAND_FILE_EXPORT;
    readonly icon = new FaIcon('fas fa-download');
    readonly group = CommandGroups.GROUP_CUT_COPY_PASTE;
    readonly label = 'Exporter';
    readonly scope = [CommandScopes.EXPLORER_TREE];

    get enabled(): boolean {
        return this.explorerService.canDownload();
    }

    constructor(private readonly explorerService: ExplorerService) {}

    execute(): void {
        this.explorerService.download();
    }
}

