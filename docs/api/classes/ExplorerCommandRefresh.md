---
title: ExplorerCommandRefresh
description: Command that refresh the explorer file tree.
---
# ExplorerCommandRefresh

`class`

Command that refresh the explorer file tree.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `enabled (readonly)` | `true` | Gets a value indicating whether the command is enabled. |
| `icon (readonly)` | `CodIcon` | Optional icon describing the command. |
| `id (readonly)` | `"explorer.commands.refresh"` | Unique identifier of the command. |
| `label (readonly)` | `"Actualiser"` | Human readable text describing the command. |

## `execute()`

## Signature

```typescript
execute(): Promise<void>
```

### Returns

`Promise<void>`
