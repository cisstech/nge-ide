import { Injectable, Injector } from "@angular/core";
import { URI } from "vscode-uri";
import { IContribution } from "../contributions";
import { Preview, PreviewHandler } from "./preview";


@Injectable()
export class PreviewService implements IContribution {
    readonly id = 'workbench.contrib.preview-service';
    private readonly registry: PreviewHandler[] = [];

    constructor(
        private readonly injector: Injector,
    ) { }

    deactivate(): void {
        this.registry.splice(0, this.registry.length);
    }

    async handle(uri: URI): Promise<Preview> {
        for (const handler of this.registry) {
            if (handler.canHandle(uri)) {
                return await handler.handle(this.injector, uri);
            }
        }
        throw new Error(`No preview handler found for ${uri.toString()}`);
    }

    canHandle(uri: URI): boolean {
        return !!this.registry.find(handler => handler.canHandle(uri));
    }

    register(...handlers: PreviewHandler[]): void {
        this.registry.push(...handlers);
    }
}
