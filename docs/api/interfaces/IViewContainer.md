---
title: IViewContainer
description: Representation of view container inside the infobar area.
---
# IViewContainer

`interface`

Representation of view container inside the infobar area.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `badge (readonly)` | `Observable<number>` | Optional badge to show with the title. |
| `id (readonly)` | `string` | Unique identifier of the container |
| `order? (readonly)` | `number` | Optional order of the container. |
| `scope (readonly)` | `ViewContainerScopes` | Location of the container |
| `title (readonly)` | `string` | Title of the container. |
