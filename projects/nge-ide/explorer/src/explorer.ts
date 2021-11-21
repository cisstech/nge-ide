import { Injector, NgModule } from '@angular/core';
import {
    CommandService,
    CONTRIBUTION,
    IContribution,
    SidebarContainer,
    ViewContainerService,
    ViewService
} from '@mcisse/nge-ide/core';
import { CodIcon } from '@mcisse/nge/ui/icon';
import { of } from 'rxjs';
import {
    ExplorerCommandCollapse,
    ExplorerCommandCopy,
    ExplorerCommandCopyPath,
    ExplorerCommandCreateFile,
    ExplorerCommandCreateFolder,
    ExplorerCommandDelete,
    ExplorerCommandFileExport,
    ExplorerCommandFileUpload,
    ExplorerCommandPaste,
    ExplorerCommandRefresh,
    ExplorerCommandRename
} from './commands';
import { ExplorerService } from './explorer.service';

/**
 * Identifier of the explorer view component.
 */
export const EXPLORER_VIEW_ID = 'workbench.view.explorer';

/**
 * Identifier of the explorer container.
 */
export const EXPLORER_CONTAINER_ID = 'workbench.container.explorer';

class ExplorerContribution implements IContribution {
    readonly id = 'workbench.contrib.explorer';

    activate(injector: Injector) {
        const viewService = injector.get(ViewService);
        const commandService = injector.get(CommandService);
        const viewContainerService = injector.get(ViewContainerService);

        commandService.register(
            ExplorerCommandCollapse,
            ExplorerCommandCopy,
            ExplorerCommandCopyPath,
            ExplorerCommandCreateFile,
            ExplorerCommandCreateFolder,
            ExplorerCommandDelete,
            ExplorerCommandFileExport,
            ExplorerCommandFileUpload,
            ExplorerCommandPaste,
            ExplorerCommandRefresh,
            ExplorerCommandRename,
        );


        viewContainerService.register(new class extends SidebarContainer {
            readonly id = EXPLORER_CONTAINER_ID;
            readonly title = 'Explorateur';
            readonly icon = new CodIcon('files');
            readonly side = 'left';
            readonly align = 'top';
        });

        viewService.register({
            id: EXPLORER_VIEW_ID,
            title: 'Explorateur',
            commands: of([
                commandService.find(ExplorerCommandRefresh),
                commandService.find(ExplorerCommandCollapse),
            ]),
            viewContainerId: EXPLORER_CONTAINER_ID,
            component: () =>
                import(
                    /* webpackChunkName: "ide-sidebar-explorer" */
                    './explorer.module'
                ).then((m) => m.ExplorerModule),
        });
    }

}


@NgModule({
    providers: [
        ExplorerCommandCollapse,
        ExplorerCommandCopy,
        ExplorerCommandCopyPath,
        ExplorerCommandCreateFile,
        ExplorerCommandCreateFolder,
        ExplorerCommandDelete,
        ExplorerCommandFileExport,
        ExplorerCommandFileUpload,
        ExplorerCommandPaste,
        ExplorerCommandRefresh,
        ExplorerCommandRename,

        ExplorerService,
        {
            provide: CONTRIBUTION,
            multi: true,
            useClass: ExplorerContribution
        }
    ]
})
export class NgeIdeExplorerModule {}

