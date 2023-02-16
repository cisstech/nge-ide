import { Injectable } from '@angular/core';
import {
  EditorService,
  FileService,
  ICommand,
  NotificationService,
} from '@cisstech/nge-ide/core';
import { CodIcon } from '@cisstech/nge/ui/icon';
import { DialogService } from '@cisstech/nge/ui/dialog';
import { ExplorerService } from '../../explorer.service';

export const EXPLORER_COMMAND_REFRESH = 'explorer.commands.refresh';

/**
 * Command that refresh the explorer file tree.
 */
@Injectable()
export class ExplorerCommandRefresh implements ICommand {
  readonly id = EXPLORER_COMMAND_REFRESH;
  readonly icon = new CodIcon('refresh');
  readonly label = 'Actualiser';

  readonly enabled = true;

  constructor(
    private readonly fileService: FileService,
    private readonly dialogService: DialogService,
    private readonly editorService: EditorService,
    private readonly explorerService: ExplorerService,
    private readonly notificationService: NotificationService
  ) {}

  async execute(): Promise<void> {
    const shouldConfirm = this.fileService.isDirty();
    try {
      const askConfirmation = () =>
        this.dialogService.confirmAsync({
          title: "Actualiser l'explorateur",
          message: 'Vous perdrez toutes les modifications non sauvegardées.',
          noTitle: 'Annuler',
          okTitle: 'Actualiser',
        });

      if (!shouldConfirm || (await askConfirmation())) {
        await this.editorService.closeAll(true);
        await this.fileService.refresh();
        this.explorerService.collapseAll();
      }
    } catch (error) {
      this.notificationService.publishError(error);
    }
  }
}
