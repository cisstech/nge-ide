import { Injectable, Injector, NgModule } from '@angular/core'
import {
  CONTRIBUTION,
  FileService,
  FileSystemProviderCapabilities,
  IContribution,
  IView,
  SidebarContainer,
  ViewContainerService,
  ViewService,
} from '@cisstech/nge-ide/core'
import { CodIcon } from '@cisstech/nge/ui/icon'
import { of, Subscription } from 'rxjs'

/**
 * Identifier of the search view component.
 */
export const SEARCH_VIEW_ID = 'workbench.view.search'

/**
 * Identifier of the search container.
 */
export const SEARCH_CONTAINER_ID = 'workbench.container.search'

@Injectable()
export class Contribution implements IContribution {
  private readonly subscriptions: Subscription[] = []
  readonly id = 'workbench.contrib.search'

  activate(injector: Injector) {
    const viewService = injector.get(ViewService)
    const fileService = injector.get(FileService)

    const viewContainerService = injector.get(ViewContainerService)

    const view: IView = {
      id: SEARCH_VIEW_ID,
      title: 'Recherche',
      commands: of([]),
      viewContainerId: SEARCH_CONTAINER_ID,
      component: () => import('./search.module').then((m) => m.SearchModule),
    }

    const container = new (class extends SidebarContainer {
      readonly id = SEARCH_CONTAINER_ID
      readonly title = 'Recherche'
      readonly icon = new CodIcon('search')
      readonly side = 'left'
      readonly align = 'top'
    })()

    let registered = false
    this.subscriptions.push(
      fileService.treeChange.subscribe(() => {
        if (fileService.hasCapabilityForAnyProvider(FileSystemProviderCapabilities.FileSearch)) {
          if (!registered) {
            viewService.register(view)
            viewContainerService.register(container)
            registered = true
          }
        } else {
          registered = false
          viewService.unregister(view.id)
          viewContainerService.unregister(container.id)
        }
      })
    )
  }

  deactivate(): void | Promise<void> {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }
}

@NgModule({
  providers: [
    {
      provide: CONTRIBUTION,
      multi: true,
      useClass: Contribution,
    },
  ],
})
export class NgeIdeSearchModule {}
