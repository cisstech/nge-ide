import { ChangeDetectionStrategy, Component, TemplateRef, input, output, viewChild } from '@angular/core'

/**
 * A single tab hosted by {@link TabsComponent}. Standalone replacement for
 * ng-zorro's `nz-tab`.
 *
 * The header is supplied through {@link title} (a plain string, or a
 * `TemplateRef` for rich content, renamed from `nzTitle`). The tab body is
 * projected through `<ng-content>` and rendered by the parent inside the active
 * tabpanel, so bodies are created lazily and only the selected one is shown.
 *
 * @example
 * ```html
 * <ide-tab [title]="labelTpl" (tabClick)="open()">Body content</ide-tab>
 * ```
 */
@Component({
  selector: 'ide-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class TabComponent {
  /** Header label: a plain string or a `TemplateRef` (renamed from `nzTitle`). */
  readonly title = input<string | TemplateRef<unknown>>()

  /** Emits when the user activates the tab via mouse or keyboard (renamed from `nzClick`). */
  readonly tabClick = output<void>()

  /** Captured tab body, rendered by {@link TabsComponent} in the active tabpanel. */
  readonly bodyTemplate = viewChild<TemplateRef<unknown>>('content')
}
