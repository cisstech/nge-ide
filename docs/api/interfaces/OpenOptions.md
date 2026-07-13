---
title: OpenOptions
description: Represents file open options.
---
# OpenOptions

`interface`

Represents file open options.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `diff? (readonly)` | `string` | open the resource with diff editor |
| `icon? (readonly)` | `Icon` | Icon to show in the tabbar (default to a file icon). |
| `openInGroup? (readonly)` | `EditorGroup` | force the editor to open the file in this group |
| `openToSide? (readonly)` | `boolean` | force the editor to open the file in a new group |
| `position? (readonly)` | `object` | jumping at the given position after the resource is opened |
| `preview? (readonly)` | `Preview` | force the editor to open the file as a preview |
| `title (readonly)` | `string` | Title to show in the tabbar. |
| `tooltip (readonly)` | `string` | Tooltip to show in the tabbar. |
