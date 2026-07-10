import { Directive } from '@angular/core'
import { CdkMenuItem } from '@angular/cdk/menu'

/**
 * A single entry inside an {@link IdeMenuComponent}.
 *
 * Replacement for ng-zorro's `<li nz-menu-item>`. It composes CDK's `cdkMenuItem`
 * through a host directive, so the item is focusable, exposes `role="menuitem"`,
 * activates on Enter/Space and closes the menu once triggered. Any `(click)`
 * handler the consumer already put on the element keeps firing as before.
 *
 * ng-zorro inputs are renamed to plain names:
 * - `nzDisabled` becomes `disabled`
 *
 * @example
 * ```html
 * <li ideMenuItem (click)="run()">Run</li>
 * <li ideMenuItem [disabled]="!canDelete" (click)="remove()">Delete</li>
 * ```
 */
@Directive({
  selector: '[ideMenuItem]',
  standalone: true,
  exportAs: 'ideMenuItem',
  hostDirectives: [
    {
      directive: CdkMenuItem,
      inputs: ['cdkMenuItemDisabled: disabled', 'cdkMenuitemTypeaheadLabel: typeaheadLabel'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
  ],
  host: {
    class: 'ide-menu-item',
  },
})
export class IdeMenuItemDirective {}
