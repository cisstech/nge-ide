import {
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  ViewContainerRef
} from '@angular/core';
import { CompilerService } from '@cisstech/nge/services';
import { Editor } from '../editors/index';

@Directive({ selector: '[editor]' })
export class EditorDirective implements OnChanges, OnDestroy {
  private readonly componentRefs = new Map<string, ComponentRef<any>>();

  @Input('editor') editor?: Editor;

  constructor(
    private readonly compiler: CompilerService,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  async ngOnChanges(): Promise<void> {
    if (this.editor) {
      let componentRef = this.componentRefs.get(this.editor.id);
      if (!componentRef) {
        componentRef = await this.compiler.render({
          container: this.viewContainerRef,
          type: await this.editor.component(),
          inputs: { editor: this.editor },
        });
        this.componentRefs.set(this.editor.id, componentRef);
      } else {
        while (this.viewContainerRef.length > 0) {
          this.viewContainerRef.detach()
        }
        this.viewContainerRef.insert(componentRef.hostView)
      }
    }
  }

  ngOnDestroy(): void {
    Object.values(this.componentRefs).forEach((componentRef) =>
      componentRef.destroy()
    );
  }
}
