---
title: SidebarContainer
description: Representation of view container inside the sidebar area.
---
# SidebarContainer

`class`

Representation of view container inside the sidebar area.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `align (readonly)` | `"top" | "bottom"` | Vertical position of the view |
| `badge (readonly)` | `Observable<number>` | Value of the badge associated to the view. |
| `dropdown?` | `object[]` | A dropdown menu to show when the container is clicked. |
| `icon (readonly)` | `Icon` | Icon of the container |
| `id (readonly)` | `string` | Unique identifier of the container |
| `scope (readonly)` | `sidebar` | Location of the container |
| `side (readonly)` | `"left" | "right"` | Horizontal position of the container |
| `title (readonly)` | `string` | Title of the container. |

## `onClickHandler()`

## Signature

```typescript
onClickHandler(): any
```

### Returns

`any`
