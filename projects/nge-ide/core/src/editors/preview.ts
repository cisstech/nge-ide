import { Injector } from "@angular/core";
import { URI } from "vscode-uri";
import { FileService } from "../files";
import { Paths } from "../utils";

export const PREVIEW_URI = URI.parse('editor://preview');

export const enum PreviewTypes {
    URL = 'URL',
    HTML = 'HTML',
    MARKDOWN = 'MARKDOWN',
}

export interface Preview {
    data: string;
    type: PreviewTypes;
}

export interface PreviewHandler {
    canHandle(uri: URI): boolean;
    handle(injector: Injector, uri: URI): Promise<Preview>;
}


export class SvgPreviewHandler implements PreviewHandler {
    canHandle(uri: URI) {
        return Paths.extname(uri.path) === 'svg'
    }

    async handle(injector: Injector, uri: URI): Promise<Preview> {
        const fileService = injector.get(FileService);
        const fileContent = await fileService.open(uri);
        return Promise.resolve({
            type: PreviewTypes.HTML,
            data: fileContent.current
        });
    }
}


export class HtmlPreviewHandler implements PreviewHandler {
    canHandle(uri: URI) {
        return Paths.extname(uri.path) === 'html'
    }

    async handle(injector: Injector, uri: URI): Promise<Preview> {
        const fileService = injector.get(FileService);
        const fileContent = await fileService.open(uri);
        return Promise.resolve({
            type: PreviewTypes.HTML,
            data: fileContent.current
        });
    }
}

export class MarkdownPreviewHandler implements PreviewHandler {
    canHandle(uri: URI) {
        return Paths.extname(uri.path) === 'md'
    };

    async handle(injector: Injector, uri: URI): Promise<Preview> {
        const fileService = injector.get(FileService);
        const fileContent = await fileService.open(uri);
        return Promise.resolve({
            type: PreviewTypes.MARKDOWN,
            data: fileContent.current
        });
    }
}
