---
title: ThemeSidebarContainer
description: Activity-bar (bottom) entry offering Light / Dark / System. The title is a
---
# ThemeSidebarContainer

`class`

Activity-bar (bottom) entry offering Light / Dark / System. The title is a
getter so the tooltip reflects the active mode.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `align (readonly)` | `"bottom"` | Vertical position of the view |
| `badge (readonly)` | `Observable<number>` | Value of the badge associated to the view. |
| `dropdown (readonly)` | `object[]` | A dropdown menu to show when the container is clicked. |
| `icon (readonly)` | `Icon` | Icon of the container |
| `id (readonly)` | `"workbench.view-container.theme"` | Unique identifier of the container |
| `scope (readonly)` | `sidebar` | Location of the container |
| `side (readonly)` | `"left"` | Horizontal position of the container |
| `title` | `unknown` | Title of the container. |

## `onClickHandler()`

## Signature

```typescript
onClickHandler(): any
```

### Returns

`any`
