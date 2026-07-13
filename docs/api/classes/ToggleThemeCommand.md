---
title: ToggleThemeCommand
description: Command-palette entry that cycles the color theme (light -> dark -> system).
---
# ToggleThemeCommand

`class`

Command-palette entry that cycles the color theme (light -> dark -> system).

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `enabled (readonly)` | `true` | Gets a value indicating whether the command is enabled. |
| `icon (readonly)` | `CodIcon` | Optional icon describing the command. |
| `id (readonly)` | `"workbench.commands.toggle-theme"` | Unique identifier of the command. |
| `label (readonly)` | `"Basculer le thème de couleur"` | Human readable text describing the command. |

## `execute()`

## Signature

```typescript
execute(): void
```

### Returns

`void`
