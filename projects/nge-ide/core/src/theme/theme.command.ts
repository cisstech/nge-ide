import { CodIcon } from '@cisstech/nge/ui/icon'
import { ICommand } from '../commands/command'
import type { ThemeService } from './theme.service'

export const TOGGLE_THEME_COMMAND = 'workbench.commands.toggle-theme'

/** Command-palette entry that cycles the color theme (light -> dark -> system). */
export class ToggleThemeCommand implements ICommand {
  readonly id = TOGGLE_THEME_COMMAND
  readonly icon = new CodIcon('color-mode')
  readonly label = 'Basculer le thème de couleur'
  readonly enabled = true

  constructor(private readonly themeService: ThemeService) {}

  execute(): void {
    this.themeService.cycle()
  }
}
