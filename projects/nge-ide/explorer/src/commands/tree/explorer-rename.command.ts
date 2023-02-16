import { Injectable } from '@angular/core';
import { CodIcon } from '@cisstech/nge/ui/icon';
import { ExplorerService } from '../../explorer.service';
import { CommandGroups, IExplorerCommand } from './explorer.command';

export const EXPLORER_COMMAND_RENAME = 'explorer.commands.rename';

@Injectable()
export class ExplorerCommandRename implements IExplorerCommand {
  readonly id = EXPLORER_COMMAND_RENAME;
  readonly icon = new CodIcon('edit');
  readonly group = CommandGroups.GROUP_MODIFICATION;
  readonly label = 'Renommer';

  get enabled(): boolean {
    return this.explorerService.canEdit();
  }

  constructor(private readonly explorerService: ExplorerService) {}

  execute() {
    this.explorerService.startEdit();
  }
}
