---
title: IdeContextMenuConfig
description: Options accepted by ContextMenuService.open.
---
# IdeContextMenuConfig

`interface`

Options accepted by ContextMenuService.open.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `autoFocus? (readonly)` | `boolean` | Move keyboard focus to the first item when the menu opens. Defaults to `true`. |
| `context? (readonly)` | `Record<string, unknown>` | Context object exposed to the menu template. |
| `positions? (readonly)` | `ConnectedPosition[]` | Positions to try, relative to the pointer. Defaults to a VS-Code-like set. |
