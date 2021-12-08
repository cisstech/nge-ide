import { Injector, NgModule, Injectable } from '@angular/core';
import {
    CommandService,
    CONTRIBUTION,
    IContribution,
    SidebarContainer,
    ToolbarButton,
    ToolbarGroups,
    ToolbarSeparator,
    ToolbarSevice,
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
    ExplorerCommandRename,
    ExplorerCommandToggleFiltering
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

@Injectable()
export class ExplorerContribution implements IContribution {
    readonly id = 'workbench.contrib.explorer';

    activate(injector: Injector) {
        const viewService = injector.get(ViewService);
        const commandService = injector.get(CommandService);
        const toolbarService = injector.get(ToolbarSevice);
        const viewContainerService = injector.get(ViewContainerService);

        commandService.register(
            ExplorerCommandToggleFiltering,
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

        toolbarService.register(
            new ToolbarButton({
                group: ToolbarGroups.FILE,
                command: commandService.find(ExplorerCommandFileUpload),
                priority: 1
            }),
            new ToolbarButton({
                group: ToolbarGroups.FILE,
                command: commandService.find(ExplorerCommandFileExport),
                priority: 1
            }),
            new ToolbarSeparator(ToolbarGroups.FILE, 1),
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
                commandService.find(ExplorerCommandToggleFiltering),
                commandService.find(ExplorerCommandRefresh),
                commandService.find(ExplorerCommandCollapse),
            ]),
            viewContainerId: EXPLORER_CONTAINER_ID,
            component: () => import('./explorer.module').then((m) => m.ExplorerModule),
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
        ExplorerCommandToggleFiltering,

        ExplorerService,
        {
            provide: CONTRIBUTION,
            multi: true,
            useClass: ExplorerContribution
        }
    ]
})
export class NgeIdeExplorerModule { }

