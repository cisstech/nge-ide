import { Injectable } from '@angular/core';
import { FaIcon } from '@mcisse/nge/ui/icon';
import { ExplorerService } from '../../explorer.service';
import { CommandGroups, IExplorerCommand } from './explorer.command';

export const EXPLORER_COMMAND_COPY = 'explorer.commands.copy';

@Injectable()
export class ExplorerCommandCopy implements IExplorerCommand {
    readonly id = EXPLORER_COMMAND_COPY;
    readonly icon = new FaIcon('fas fa-clone');
    readonly group = CommandGroups.GROUP_CUT_COPY_PASTE;
    readonly label = 'Copier';

    get enabled(): boolean {
        return this.explorerService.canCopy();
    }

    constructor(private readonly explorerService: ExplorerService) {}

    execute(): void {
        this.explorerService.copy();
    }
}

