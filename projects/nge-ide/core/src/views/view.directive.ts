import { ComponentRef, Directive, Input, OnChanges, OnDestroy, ViewContainerRef } from '@angular/core';
import { CompilerService } from '@cisstech/nge/services';
import { IView } from './view';

// tslint:disable-next-line: directive-selector
@Directive({ selector: '[view]' })
export class ViewDirective implements OnChanges, OnDestroy {
    private componentRef?: ComponentRef<any>;

    // tslint:disable-next-line: no-input-rename
    @Input('view')
    view?: IView;

    @Input() inputs: Record<string, any> = {};

    constructor(
        private readonly compiler: CompilerService,
        private readonly viewContainerRef: ViewContainerRef
    ) {}

    async ngOnChanges(): Promise<void> {
        if (this.view) {
            this.componentRef?.destroy();
            this.componentRef = await this.compiler.render({
                container: this.viewContainerRef,
                type: await this.view.component(),
                inputs: this.inputs
            });
        }
    }

    ngOnDestroy(): void {
        this.componentRef?.destroy();
    }
}
