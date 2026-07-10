import { ComponentRef, Directive, Input, OnChanges, OnDestroy, ViewContainerRef } from '@angular/core'
import { CompilerService } from '@cisstech/nge/services'
import { Editor } from '../editors/index'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[editor]',
  standalone: false,
})
export class EditorDirective implements OnChanges, OnDestroy {
  private readonly componentRefs = new Map<string, ComponentRef<unknown>>()

  @Input() editor?: Editor

  constructor(
    private readonly compiler: CompilerService,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  async ngOnChanges(): Promise<void> {
    if (this.editor) {
      // Always detach the currently displayed editor before showing the target
      // one. Otherwise opening an editor that has not been rendered yet (e.g. a
      // custom editor on top of a code editor) would append its component while
      // the previous one stays in the container, leaving two editors in the DOM.
      while (this.viewContainerRef.length > 0) {
        this.viewContainerRef.detach()
      }

      let componentRef = this.componentRefs.get(this.editor.id)
      if (!componentRef) {
        componentRef = await this.compiler.render({
          container: this.viewContainerRef,
          type: await this.editor.component(),
          inputs: { editor: this.editor },
        })
        this.componentRefs.set(this.editor.id, componentRef)
      } else {
        this.viewContainerRef.insert(componentRef.hostView)
      }
    }
  }

  ngOnDestroy(): void {
    // componentRefs is a Map, so iterate it directly: Object.values() on a Map
    // returns [] and would leak every cached editor component.
    this.componentRefs.forEach((componentRef) => componentRef.destroy())
    this.componentRefs.clear()
  }
}
