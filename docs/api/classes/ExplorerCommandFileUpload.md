---
title: ExplorerCommandFileUpload
description: Commands available inside the explorer container.
---
# ExplorerCommandFileUpload

`class`

Commands available inside the explorer container.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `group (readonly)` | `GROUP_CUT_COPY_PASTE` | Command group. |
| `icon (readonly)` | `FaIcon` | Optional icon describing the command. |
| `id (readonly)` | `"explorer.commands.file-upload"` | Unique identifier of the command. |
| `label (readonly)` | `"Importer"` | Human readable text describing the command. |
| `enabled` | `unknown` | Gets a value indicating whether the command is enabled. |

## `execute()`

## Signature

```typescript
execute(): Promise<void>
```

### Returns

`Promise<void>`
