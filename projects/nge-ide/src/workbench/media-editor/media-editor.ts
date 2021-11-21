import { Editor, FileService, OpenRequest, Paths } from "@mcisse/nge-ide/core";

const extensions = [
    'mp3', 'wav', 'ogg', // audio
    'mp4', 'webm',  // video
    'jpeg', 'gif', 'png', 'apng', 'svg', 'bmp', 'bmp', 'ico', 'ico', // img
];

export class MediaEditor extends Editor {
    component = () => import('./media-editor.module').then(m => m.MediaEditorModule);
    canHandle(request: OpenRequest): boolean {
        const fileService = request.injector.get(FileService);
        const file = fileService.find(request.uri);
        const extension = Paths.extname(request.uri.path);
        return !!file?.downloadUrl && extensions.includes(extension)
    }
}
