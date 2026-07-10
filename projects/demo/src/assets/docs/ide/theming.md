# Theming

The IDE ships with light, dark and system themes and applies them itself. There
is no stylesheet to add to `angular.json`: on startup the `ThemeService` injects
a scoped stylesheet, and it removes it on teardown. The theme is scoped to
`ide-root` and the IDE's own overlays, so it never writes to `<body>` or `<html>`
and stays independent of the host application's styling.

## For users

A theme entry sits at the bottom of the activity bar. Its dropdown offers
**Clair**, **Sombre** and **Système** (light, dark, system). The choice is
persisted and defaults to system, which follows the OS `prefers-color-scheme`.
The `Basculer le thème de couleur` command cycles through the three.

## Controlling it in code

`ThemeService` is provided in root, so you can inject it anywhere:

```ts
import { ThemeService } from '@cisstech/nge-ide/core'

const theme = inject(ThemeService)

theme.setMode('dark') // 'light' | 'dark' | 'system'
theme.mode() // the selected mode
theme.resolved() // 'light' | 'dark', with 'system' resolved through the OS
theme.cycle() // light -> dark -> system -> light
```

`mode` and `resolved` are signals, so they compose with the rest of your reactive
code.

## The editor theme

The Monaco editor follows the resolved theme automatically, pairing `github`
(light) with `github-dark` (dark). Make sure both are available to
`NgeMonacoModule`; they are included in `NGE_MONACO_THEMES` by default. Leave
`darkThemeClassName` unset so the IDE remains the single source of truth for the
editor theme.

## Re-branding

The IDE reads its colours from CSS custom properties. Override them in a global
stylesheet, scoped to the IDE host and, for pop-ups, to the overlay classes:

```css
ide-root,
.ide-theme-light {
  --focus-border: #7c3aed;
  --activityBar-activeBorder: #7c3aed;
}

ide-root[data-theme='dark'],
.ide-theme-dark {
  --focus-border: #a78bfa;
  --activityBar-activeBorder: #a78bfa;
}
```

The overlay classes matter because menus, dropdowns, tooltips and dialogs render
outside `ide-root` (in a CDK overlay under `<body>`); the IDE tags each of its
overlays with `ide-theme-light` or `ide-theme-dark` so your tokens reach them.
