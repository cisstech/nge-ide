import { DOCUMENT, Injectable, Injector, computed, effect, inject, signal } from '@angular/core'
import { NgeMonacoThemeService } from '@cisstech/nge/monaco'
import { firstValueFrom } from 'rxjs'
import { CommandService } from '../commands/command.service'
import { IContribution } from '../contributions/contribution'
import { StorageService } from '../storage/storage.service'
import { ViewContainerService } from '../views/view-container.service'
import { ToggleThemeCommand } from './theme.command'
import { ThemeSidebarContainer } from './theme.container'
import { IDE_THEME_CSS } from './theme.styles'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme.mode'
const STYLE_ID = 'nge-ide-theme'

/** Monaco theme names paired with the IDE light/dark themes (from @cisstech/nge). */
const LIGHT_MONACO_THEME = 'github'
const DARK_MONACO_THEME = 'github-dark'

/**
 * Shared, ref-counted `<style>` so several IDE instances on one page inject the
 * tokens once and the last one to leave removes them.
 */
let styleRefCount = 0

/**
 * Owns the IDE's color theme.
 *
 * The theme is entirely self-contained: on start it injects its token stylesheet
 * and applies the saved (or system) theme; on stop it removes the stylesheet and
 * restores Monaco. Everything is scoped to the `ide-root` host and IDE overlay
 * panels, so the host application's own theme is never read or written and the
 * IDE leaves no trace when it unmounts.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService implements IContribution {
  readonly id = 'workbench.contrib.theme'

  private readonly document = inject(DOCUMENT)
  private readonly monaco = inject(NgeMonacoThemeService)

  // Resolved from the IDE (CoreModule) injector in activate(), not at construction:
  // this service is root-scoped so it can be reached from wider scopes (e.g. the
  // dialog service), where CoreModule-provided StorageService is not visible.
  private storage?: StorageService

  private styleElement?: HTMLStyleElement
  private mediaQuery?: MediaQueryList
  private mediaListener?: (event: MediaQueryListEvent) => void
  private previousMonacoTheme?: string

  private readonly _mode = signal<ThemeMode>('system')
  private readonly _systemDark = signal<boolean>(this.prefersDark())
  private readonly _ready = signal<boolean>(false)

  /** The user-selected mode: `light`, `dark` or `system`. */
  readonly mode = this._mode.asReadonly()

  /** The concrete theme in effect, resolving `system` through the OS setting. */
  readonly resolved = computed<ResolvedTheme>(() =>
    this._mode() === 'system' ? (this._systemDark() ? 'dark' : 'light') : (this._mode() as ResolvedTheme)
  )

  /** CSS class to stamp on CDK overlay panels so they follow the IDE theme. */
  readonly overlayClass = computed(() => `ide-theme-${this.resolved()}`)

  constructor() {
    // Keep Monaco (a page-global editor theme) in sync with the resolved theme,
    // but only once the editor is loaded (guarded by `_ready`).
    effect(() => {
      const theme = this.resolved()
      if (this._ready()) {
        this.applyMonaco(theme)
      }
    })
  }

  async activate(injector: Injector): Promise<void> {
    this.storage = injector.get(StorageService)
    this.injectStyle()
    this.watchSystem()
    this.capturePreviousMonacoTheme()

    const saved = await firstValueFrom(this.storage.get<ThemeMode>(STORAGE_KEY, 'system'))
    this._mode.set(this.normalize(saved))

    this._ready.set(true)
    this.applyMonaco(this.resolved())

    injector.get(CommandService).register(new ToggleThemeCommand(this))
    injector.get(ViewContainerService).register(new ThemeSidebarContainer(this))
  }

  deactivate(): void {
    this.removeStyle()
    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener('change', this.mediaListener)
    }
    this._ready.set(false)
    if (this.previousMonacoTheme) {
      this.monaco.setTheme(this.previousMonacoTheme).catch(() => undefined)
    }
  }

  /** Sets the theme mode and persists the choice. */
  setMode(mode: ThemeMode): void {
    this._mode.set(this.normalize(mode))
    this.storage?.set(STORAGE_KEY, this._mode()).subscribe()
  }

  /** Cycles `light` -> `dark` -> `system` -> `light`. */
  cycle(): void {
    const next: Record<ThemeMode, ThemeMode> = { light: 'dark', dark: 'system', system: 'light' }
    this.setMode(next[this._mode()])
  }

  private applyMonaco(theme: ResolvedTheme): void {
    this.monaco.setTheme(theme === 'dark' ? DARK_MONACO_THEME : LIGHT_MONACO_THEME).catch(() => undefined)
  }

  private capturePreviousMonacoTheme(): void {
    try {
      this.previousMonacoTheme = (this.monaco.theme as { themeName?: string } | undefined)?.themeName
    } catch {
      this.previousMonacoTheme = undefined
    }
  }

  private normalize(mode?: ThemeMode | null): ThemeMode {
    return mode === 'light' || mode === 'dark' || mode === 'system' ? mode : 'system'
  }

  private injectStyle(): void {
    styleRefCount++
    if (this.document.getElementById(STYLE_ID)) {
      return
    }
    const style = this.document.createElement('style')
    style.id = STYLE_ID
    style.textContent = IDE_THEME_CSS
    this.document.head.appendChild(style)
    this.styleElement = style
  }

  private removeStyle(): void {
    styleRefCount = Math.max(0, styleRefCount - 1)
    if (styleRefCount === 0) {
      ;(this.styleElement ?? this.document.getElementById(STYLE_ID))?.remove()
    }
    this.styleElement = undefined
  }

  private prefersDark(): boolean {
    return !!this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches
  }

  private watchSystem(): void {
    const media = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)')
    if (!media) {
      return
    }
    this.mediaQuery = media
    this._systemDark.set(media.matches)
    this.mediaListener = (event) => this._systemDark.set(event.matches)
    media.addEventListener('change', this.mediaListener)
  }
}
