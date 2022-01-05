import { Injectable } from '@angular/core';
import { FaIcon } from '@mcisse/nge/ui/icon';
import { ExplorerService } from '../../explorer.service';
import { CommandGroups, IExplorerCommand } from './explorer.command';

export const EXPLORER_COMMAND_PASTE = 'explorer.commands.paste';

@Injectable()
export class ExplorerCommandPaste implements IExplorerCommand {
    readonly id = EXPLORER_COMMAND_PASTE;
    readonly icon = new FaIcon('fas fa-paste');
    readonly group = CommandGroups.GROUP_CUT_COPY_PASTE;
    readonly label = 'Coller';

    get enabled(): boolean {
        return this.explorerService.canPaste();
    }

    constructor(private readonly explorerService: ExplorerService) {}

    execute(): void {
        this.explorerService.paste();
    }
}
