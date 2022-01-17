import { Editor, OpenRequest, SETTINGS_URI } from "@mcisse/nge-ide/core";

export class SettingsEditor extends Editor {
    component = () => import('./settings-editor.module').then(m => m.SettingsEditorModule);
    canHandle(request: OpenRequest): boolean {
        return request.uri.toString(true) === SETTINGS_URI;
    }
}
