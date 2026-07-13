---
title: ICommand
---
# ICommand

`interface`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `enabled (readonly)` | `boolean` | Gets a value indicating whether the command is enabled. |
| `icon? (readonly)` | `Icon` | Optional icon describing the command. |
| `id (readonly)` | `string` | Unique identifier of the command. |
| `keybinding? (readonly)` | `string | Keybinding` | Keyboard shortcut that will trigger the command. |
| `label (readonly)` | `string` | Human readable text describing the command. |

## `execute()`

## Signature

```typescript
execute(): void | Promise<void>
```

### Returns

`void | Promise<void>`
