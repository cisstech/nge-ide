import { Injectable } from '@angular/core';
import { CommandScopes, EditorService, FileService, ICommand, NotificationService } from '@mcisse/nge-ide/core';
import { CodIcon } from '@mcisse/nge/ui/icon';
import { DialogService } from '@mcisse/nge/ui/dialog';


export const EXPLORER_COMMAND_REFRESH = 'explorer.commands.refresh';

/**
 * Command that refresh the explorer file tree.
 */
@Injectable()
export class ExplorerCommandRefresh implements ICommand {
    readonly id = EXPLORER_COMMAND_REFRESH;
    readonly icon = new CodIcon('refresh');
    readonly label = 'Actualiser';
    readonly scope = [CommandScopes.EXPLORER_TITLE_BAR];

    readonly enabled = true;

    constructor(
        private readonly fileService: FileService,
        private readonly dialogService: DialogService,
        private readonly editorService: EditorService,
        private readonly notificationService: NotificationService,
    ) {}

    async execute(): Promise<void> {
        const shouldConfirm = this.fileService.isDirty();
        try {
            const askConfirmation = () => this.dialogService.confirmAsync({
                    title: 'Actualiser l\'explorateur',
                    message: 'Vous perdrez toutes les modifications non sauvegardées. Vous êtes sûr ?',
                    noTitle: 'Annuler',
                    okTitle: 'Actualiser',
                });

            if (!shouldConfirm || await askConfirmation()) {
                await this.editorService.closeAll();
                await this.fileService.refresh();
            }
        } catch (error) {
            this.notificationService.publishError(error);
        }
    }
}
