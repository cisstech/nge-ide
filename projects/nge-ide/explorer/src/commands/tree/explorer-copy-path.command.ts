import { Injectable } from '@angular/core';
import { ClipboardService } from '@cisstech/nge/services';
import { FaIcon } from '@cisstech/nge/ui/icon';
import { ExplorerService } from '../../explorer.service';
import { CommandGroups, IExplorerCommand } from './explorer.command';

export const EXPLORER_COMMAND_COPY_PATH = 'explorer.commands.copy-path';

@Injectable()
export class ExplorerCommandCopyPath implements IExplorerCommand {
  readonly id = EXPLORER_COMMAND_COPY_PATH;
  readonly icon = new FaIcon('fas fa-link');
  readonly group = CommandGroups.GROUP_COPY_PASTE;
  readonly label = 'Copier le chemin';

  get enabled(): boolean {
    return this.explorerService.hasSelection();
  }

  constructor(
    private readonly explorerService: ExplorerService,
    private readonly clipboardService: ClipboardService
  ) {}

  execute(): void {
    const selections = this.explorerService.selections();
    const length = selections.length;
    if (length) {
      this.clipboardService.copy(
        selections.map((e) => e.uri.fsPath).join('\n')
      );
    }
  }
}
