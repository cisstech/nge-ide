import { Editor, FileService, OpenRequest } from '@cisstech/nge-ide/core';

export class CodeEditor extends Editor {
  component = () =>
    import('./code-editor.module').then((m) => m.CodeEditorModule);

  async canHandle(request: OpenRequest): Promise<boolean> {
    const fileService = request.injector.get(FileService);
    return fileService.find(request.uri) != null;
  }
}
