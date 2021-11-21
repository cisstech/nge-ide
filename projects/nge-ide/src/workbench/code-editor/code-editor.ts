import { Editor, OpenRequest } from "@mcisse/nge-ide/core";

export class CodeEditor extends Editor {
    component = () => import('./code-editor.module').then(m => m.CodeEditorModule);
    canHandle(request: OpenRequest): boolean {
        return true;
    }
}
