import { Injectable } from '@angular/core';
import { CodIcon } from '@cisstech/nge/ui/icon';
import { ExplorerService } from '../../explorer.service';
import { CommandGroups, IExplorerCommand } from './explorer.command';

export const EXPLORER_COMMAND_CREATE_FOLDER = 'explorer.commands.create-folder';

@Injectable()
export class ExplorerCommandCreateFolder implements IExplorerCommand {
  readonly id = EXPLORER_COMMAND_CREATE_FOLDER;
  readonly icon = new CodIcon('new-folder');
  readonly group = CommandGroups.GROUP_WORKSPACE;
  readonly label = 'Nouveau dossier';

  get enabled(): boolean {
    return this.explorerService.canCreateFile();
  }

  constructor(private readonly explorerService: ExplorerService) {}

  execute(): void {
    this.explorerService.createFolder();
  }
}
