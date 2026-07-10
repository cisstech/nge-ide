import { CodIcon, Icon } from '@cisstech/nge/ui/icon'
import { SidebarContainer } from '../views/view-container'
import type { ThemeMode, ThemeService } from './theme.service'

export const THEME_CONTAINER_ID = 'workbench.view-container.theme'

/**
 * Activity-bar (bottom) entry offering Light / Dark / System. The title is a
 * getter so the tooltip reflects the active mode.
 */
export class ThemeSidebarContainer extends SidebarContainer {
  readonly id = THEME_CONTAINER_ID
  readonly icon: Icon = new CodIcon('color-mode')
  readonly side = 'left' as const
  readonly align = 'bottom' as const

  // Actions are lazy (evaluated on click), so referencing themeService here is safe.
  readonly dropdown = [
    { label: 'Clair', action: () => this.themeService.setMode('light') },
    { label: 'Sombre', action: () => this.themeService.setMode('dark') },
    { label: 'Système', action: () => this.themeService.setMode('system') },
  ]

  constructor(private readonly themeService: ThemeService) {
    super()
  }

  get title(): string {
    const labels: Record<ThemeMode, string> = { light: 'Clair', dark: 'Sombre', system: 'Système' }
    return `Thème : ${labels[this.themeService.mode()]}`
  }
}
