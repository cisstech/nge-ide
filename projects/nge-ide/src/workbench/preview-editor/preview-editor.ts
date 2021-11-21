import { Editor, OpenRequest } from "@mcisse/nge-ide/core";

export class PreviewEditor extends Editor {
    component = () => import('./preview-editor.module').then(m => m.PreviewEditorModule)
    canHandle(request: OpenRequest): boolean {
        return true;
    }
}
