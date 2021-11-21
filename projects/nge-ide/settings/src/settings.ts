import { Injector, NgModule } from '@angular/core';
import { CONTRIBUTION, IContribution, SidebarContainer, ViewContainerService, ViewService } from '@mcisse/nge-ide/core';
import { CodIcon } from '@mcisse/nge/ui/icon';
import { of } from 'rxjs';

/**
 * Identifier of the settings view component.
 */
export const SETTINGS_VIEW_ID = 'workbench.view.settings';

/**
 * Identifier of the settings container.
 */
export const SETTINGS_CONTAINER_ID = 'workbench.container.settings';


class Contribution implements IContribution {
    readonly id = 'workbench.contrib.settings';

    activate(injector: Injector) {
        const viewService = injector.get(ViewService);
        const viewContainerService = injector.get(ViewContainerService);

        viewService.register({
            id: SETTINGS_VIEW_ID,
            title: 'Paramètres',
            commands: of([]),
            viewContainerId: SETTINGS_CONTAINER_ID,
            component: () =>
                import(
                    /* webpackChunkName: "ide-sidebar-settings" */
                    './settings.module'
                ).then((m) => m.SettingsModule),
        });

        viewContainerService.register(
            new (class extends SidebarContainer {
                readonly id = SETTINGS_CONTAINER_ID;
                readonly title = 'Paramètres';
                readonly icon = new CodIcon('settings-gear');
                readonly side = 'left';
                readonly align = 'bottom';
            })()
        );
    }
}

@NgModule({
    providers: [
        {
            provide: CONTRIBUTION,
            multi: true,
            useClass: Contribution
        }
    ]
})
export class NgeIdeSettingsModule { }
