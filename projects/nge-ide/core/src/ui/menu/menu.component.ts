import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core'
import { CdkMenu } from '@angular/cdk/menu'
import { ThemeService } from '../../theme/theme.service'

/**
 * Menu panel that lays out a list of {@link IdeMenuItemDirective} entries.
 *
 * Drop-in replacement for ng-zorro's `<ul nz-menu>`. It composes CDK's `cdkMenu`
 * through a host directive, so the panel is keyboard navigable (arrow keys,
 * Home/End, type-ahead) and carries the correct `role="menu"` semantics without
 * any extra wiring.
 *
 * The panel is meant to live inside an `<ng-template>` that is either referenced
 * by an {@link IdeMenuTriggerDirective} (click dropdowns) or opened at the
 * pointer through {@link ContextMenuService} (context menus).
 *
 * Styling uses `ViewEncapsulation.None` on purpose: the panel and its items are
 * projected into a CDK overlay that lives outside this component's view, so the
 * rules are published globally under the `.ide-menu` / `.ide-menu-item` classes.
 *
 * @example
 * ```html
 * <button [ideMenuTriggerFor]="fileMenu">File</button>
 * <ng-template #fileMenu>
 *   <ul ideMenu>
 *     <li ideMenuItem (click)="save()">Save</li>
 *     <ide-divider />
 *     <li ideMenuItem [disabled]="true">Save all</li>
 *   </ul>
 * </ng-template>
 * ```
 */
@Component({
  selector: '[ideMenu]',
  standalone: true,
  exportAs: 'ideMenu',
  template: '<ng-content></ng-content>',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [CdkMenu],
  host: {
    class: 'ide-menu',
    // The panel renders in a CDK overlay under <body>; carry the IDE theme so
    // its tokens resolve there too.
    '[class.ide-theme-dark]': "theme() === 'dark'",
    '[class.ide-theme-light]': "theme() === 'light'",
  },
})
export class IdeMenuComponent {
  protected readonly theme = inject(ThemeService).resolved
}
