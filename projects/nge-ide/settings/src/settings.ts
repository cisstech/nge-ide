import { Injector, NgModule, Injectable } from '@angular/core';
import {
  CONTRIBUTION,
  EditorService,
  IContribution,
  SETTINGS_URI,
  SidebarContainer,
  ViewContainerService,
} from '@cisstech/nge-ide/core';
import { CodIcon } from '@cisstech/nge/ui/icon';
import { SettingsEditor } from './settings-editor/settings-editor';

/**
 * Identifier of the settings container.
 */
export const SETTINGS_CONTAINER_ID = 'workbench.container.settings';

@Injectable()
export class Contribution implements IContribution {
  readonly id = 'workbench.contrib.settings';

  activate(injector: Injector) {
    const editorService = injector.get(EditorService);
    const viewContainerService = injector.get(ViewContainerService);

    editorService.registerEditors(new SettingsEditor());

    viewContainerService.register(
      new (class extends SidebarContainer {
        readonly id = SETTINGS_CONTAINER_ID;
        readonly title = 'Paramètres';
        readonly icon = new CodIcon('settings-gear');
        readonly side = 'left';
        readonly align = 'bottom';
        readonly order = 100000000;
        readonly onClickHandler = () =>
          editorService.open(monaco.Uri.parse(SETTINGS_URI), {
            title: 'Paramètres',
          });
      })()
    );
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
export class NgeIdeSettingsModule {}
