---
title: IView
description: Representation of a part of the editor (statusbar, sidebar...).
---
# IView

`interface`

Representation of a part of the editor (statusbar, sidebar...).

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `commands` | `Observable<ICommand[]>` | Commands attached to the view. |
| `component` | `() => Type<any> | Promise<Type<any>>` | Component that render the view. |
| `id` | `string` | Unique identifier of the view. |
| `title` | `string` | Title of the view. |
| `viewContainerId` | `string` | Identifier of the view container where the view belong to. |
