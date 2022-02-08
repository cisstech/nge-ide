import { ComponentRef, Directive, Input, OnChanges, OnDestroy, ViewContainerRef } from '@angular/core';
import { CompilerService } from '@cisstech/nge/services';
import { Editor } from '../editors/index';

@Directive({ selector: '[editor]' })
export class EditorDirective implements OnChanges, OnDestroy {
    private componentRef?: ComponentRef<any>;

    @Input('editor') editor?: Editor;

    constructor(
        private readonly compiler: CompilerService,
        private readonly viewContainerRef: ViewContainerRef
    ) {}

    async ngOnChanges(): Promise<void> {
        if (this.editor) {
            this.componentRef?.destroy();
            this.componentRef = await this.compiler.render({
                container: this.viewContainerRef,
                type: await this.editor.component(),
                inputs: {
                    editor: this.editor
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.componentRef?.destroy();
    }
}
