import { Injectable } from "@angular/core";
import { CodIcon } from "@cisstech/nge/ui/icon";
import { ICommand } from "../../commands";
import { EditorService } from "../editor.service";
import { PreviewService } from "../preview.service";


export const EDITOR_PREVIEW_COMMAND = 'editor.commands.preview';

@Injectable()
export class EditorPreviewCommand implements ICommand {
    readonly id = EDITOR_PREVIEW_COMMAND;
    readonly icon = new CodIcon('open-preview');
    readonly label = 'PrĂ©visualiser';

    get enabled(): boolean {
        const { activeGroup } = this.editorService;
        if (!activeGroup) {
            return false;
        }
        const activeResource = activeGroup.activeResource;
        if (!activeResource) {
            return false;
        }

        return !activeGroup.isInPreviewMode && this.previewService.canHandle(activeResource);
    }

    constructor(
        private readonly editorService: EditorService,
        private readonly previewService: PreviewService,
    ) { }

    async execute(): Promise<void> {
        const { activeResource } = this.editorService;
        if (!activeResource) {
            return;
        }

        await this.editorService.open(activeResource, {
            preview: await this.previewService.handle(activeResource),
        })
    }
}
