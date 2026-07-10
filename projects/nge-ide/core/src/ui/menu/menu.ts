import { IdeMenuComponent } from './menu.component'
import { IdeMenuItemDirective } from './menu-item.directive'
import { IdeMenuTriggerDirective } from './menu-trigger.directive'

export * from './menu.component'
export * from './menu-item.directive'
export * from './menu-trigger.directive'
export * from './context-menu.service'

/** Every menu directive/component, for a single-line `imports` entry. */
export const IDE_MENU_DIRECTIVES = [IdeMenuComponent, IdeMenuItemDirective, IdeMenuTriggerDirective] as const
