import { Injector, NgModule, Provider, Injectable } from '@angular/core';
import {
    CommandService,
    CONTRIBUTION,
    IContribution,
    SidebarContainer,
    ViewContainerService,
    ViewService
} from '@cisstech/nge-ide/core';
import { CodIcon } from '@cisstech/nge/ui/icon';
import { of } from 'rxjs';

/**
 * Identifier of the search view component.
 */
export const SEARCH_VIEW_ID = 'workbench.view.search';

/**
 * Identifier of the search container.
 */
export const SEARCH_CONTAINER_ID = 'workbench.container.search';

@Injectable()
export class Contribution implements IContribution {
    readonly id = 'workbench.contrib.search';

    activate(injector: Injector) {
        const viewService = injector.get(ViewService);
        const commandService = injector.get(CommandService);
        const viewContainerService = injector.get(ViewContainerService);

        viewService.register({
            id: SEARCH_VIEW_ID,
            title: 'Recherche',
            commands: of([]),
            viewContainerId: SEARCH_CONTAINER_ID,
            component: () => import('./search.module').then((m) => m.SearchModule),
        });

        viewContainerService.register(
            new (class extends SidebarContainer {
                readonly id = SEARCH_CONTAINER_ID;
                readonly title = 'Recherche';
                readonly icon = new CodIcon('search');
                readonly side = 'left';
                readonly align = 'top';
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
export class NgeIdeSearchModule {}
