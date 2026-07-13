---
title: ThemeService
description: Owns the IDE's color theme.
---
# ThemeService

`class`

Owns the IDE's color theme.

The theme is entirely self-contained: on start it injects its token stylesheet
and applies the saved (or system) theme; on stop it removes the stylesheet and
restores Monaco. Everything is scoped to the `ide-root` host and IDE overlay
panels, so the host application's own theme is never read or written and the
IDE leaves no trace when it unmounts.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `"workbench.contrib.theme"` | Unique identifier of the contribution. |
| `mode (readonly)` | `Signal<ThemeMode>` | The user-selected mode: `light`, `dark` or `system`. |
| `overlayClass (readonly)` | `Signal<string>` | CSS class to stamp on CDK overlay panels so they follow the IDE theme. |
| `resolved (readonly)` | `Signal<ResolvedTheme>` | The concrete theme in effect, resolving `system` through the OS setting. |

## `activate()`

## Signature

```typescript
activate(injector: Injector): Promise<void>
```

### Parameters

- `injector` (`Injector`) - An injector to use for injecting tokens.

### Returns

`Promise<void>`

## `cycle()`

## Signature

```typescript
cycle(): void
```

### Returns

`void`

## `deactivate()`

## Signature

```typescript
deactivate(): void
```

### Returns

`void`

## `setMode()`

## Signature

```typescript
setMode(mode: ThemeMode): void
```

### Parameters

- `mode` (`ThemeMode`)

### Returns

`void`
