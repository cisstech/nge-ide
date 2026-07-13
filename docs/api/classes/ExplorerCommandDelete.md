---
title: ExplorerCommandDelete
description: Commands available inside the explorer container.
---
# ExplorerCommandDelete

`class`

Commands available inside the explorer container.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `group (readonly)` | `GROUP_MODIFICATION` | Command group. |
| `icon (readonly)` | `CodIcon` | Optional icon describing the command. |
| `id (readonly)` | `"explorer.commands.delete"` | Unique identifier of the command. |
| `label (readonly)` | `"Supprimer"` | Human readable text describing the command. |
| `enabled` | `unknown` | Gets a value indicating whether the command is enabled. |

## `execute()`

## Signature

```typescript
execute(): Promise<void>
```

### Returns

`Promise<void>`
