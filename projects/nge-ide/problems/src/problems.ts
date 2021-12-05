import { Injector, NgModule } from '@angular/core';
import {
    CONTRIBUTION,
    DiagnosticService,
    IContribution,
    InfobarContainer,
    StatusBarService,
    ViewContainerService,
    ViewService
} from '@mcisse/nge-ide/core';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Identifier of the problems view component.
 */
export const PROBLEMS_VIEW_ID = 'workbench.view.problems';

/**
 * Identifier of the problems container.
 */
export const PROBLEMS_CONTAINER_ID = 'workbench.container.problems';

export class Contribution implements IContribution {
    readonly id = 'workbench.contrib.problems';

    activate(injector: Injector) {
        const viewService = injector.get(ViewService);
        const statusBarService = injector.get(StatusBarService);
        const diagnosticService = injector.get(DiagnosticService);
        const viewContainerService = injector.get(ViewContainerService);

        viewService.register({
            id: PROBLEMS_VIEW_ID,
            title: 'PROBLÈMES',
            commands: of(),
            viewContainerId: PROBLEMS_CONTAINER_ID,
            component: () => import('./problems.module').then((m) => m.ProblemsModule)
        });

        viewContainerService.register(
            new (class extends InfobarContainer {
                readonly id = PROBLEMS_CONTAINER_ID;
                readonly title = 'PROBLÈMES';
                readonly badge = diagnosticService.count;
            })()
        );

        statusBarService.register({
            id: 'workbench.status-bar-item.problems',
            active: of(true),
            content: combineLatest([diagnosticService.errors, diagnosticService.warnings]).pipe(
                map(([errors, warnings]) => {
                    return `
                        <span class="status-bar-icon codicon codicon-error"></span><span>${errors}</span>
                        <span class="status-bar-icon codicon codicon-warning"></span><span>${warnings}</span>
                    `;
                })
            ),
            side: 'left',
            tooltip: 'Afficher les problèmes',
            action: () => {
                viewContainerService.open(PROBLEMS_CONTAINER_ID);
            }
        })
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
export class NgeIdeProblemsModule { }
