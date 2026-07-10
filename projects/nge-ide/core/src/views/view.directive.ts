import { ComponentRef, Directive, Input, OnChanges, OnDestroy, ViewContainerRef } from '@angular/core'
import { CompilerService } from '@cisstech/nge/services'
import { IView } from './view'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[view]',
  standalone: false,
})
export class ViewDirective implements OnChanges, OnDestroy {
  private componentRef?: ComponentRef<unknown>

  @Input()
  view?: IView

  @Input() inputs: Record<string, unknown> = {}

  constructor(
    private readonly compiler: CompilerService,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  async ngOnChanges(): Promise<void> {
    if (this.view) {
      this.componentRef?.destroy()
      this.componentRef = await this.compiler.render({
        container: this.viewContainerRef,
        type: await this.view.component(),
        inputs: this.inputs,
      })
    }
  }

  ngOnDestroy(): void {
    this.componentRef?.destroy()
  }
}
