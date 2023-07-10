import { Editor, OpenRequest, SETTINGS_URI } from '@cisstech/nge-ide/core';

export class SettingsEditor extends Editor {
  component = () =>
    import('./settings-editor.module').then((m) => m.SettingsEditorModule);
  canHandle(request: OpenRequest): boolean {
    return request.uri.with({ query: '' }).toString(true) === SETTINGS_URI;
  }
}
