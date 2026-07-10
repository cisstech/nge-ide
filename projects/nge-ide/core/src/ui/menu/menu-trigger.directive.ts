import { Directive } from '@angular/core'
import { CdkMenuTrigger } from '@angular/cdk/menu'

/**
 * Turns its host element into a click trigger that opens an
 * {@link IdeMenuComponent} declared in an `<ng-template>`.
 *
 * Replacement for ng-zorro's `nz-dropdown` + `[nzDropdownMenu]`. It composes
 * CDK's `cdkMenuTriggerFor` through a host directive: clicking toggles the menu,
 * arrow keys open it, `aria-haspopup` / `aria-expanded` are kept in sync and the
 * menu closes on outside click, Escape or selection.
 *
 * ng-zorro bindings are renamed:
 * - `[nzDropdownMenu]="menu"` becomes `[ideMenuTriggerFor]="menu"`, where `menu`
 *   is a `TemplateRef` (an `<ng-template>`) rather than an `<nz-dropdown-menu>`.
 *
 * @example
 * ```html
 * <button ideButton [ideMenuTriggerFor]="menu">Edit</button>
 * <ng-template #menu>
 *   <ul ideMenu>
 *     <li ideMenuItem (click)="undo()">Undo</li>
 *   </ul>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[ideMenuTriggerFor]',
  standalone: true,
  exportAs: 'ideMenuTrigger',
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: [
        'cdkMenuTriggerFor: ideMenuTriggerFor',
        'cdkMenuPosition: ideMenuPosition',
        'cdkMenuTriggerData: ideMenuTriggerData',
      ],
      outputs: ['cdkMenuOpened: ideMenuOpened', 'cdkMenuClosed: ideMenuClosed'],
    },
  ],
})
export class IdeMenuTriggerDirective {}
