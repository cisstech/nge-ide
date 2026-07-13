---
title: IdeModalContainerData
description: Normalized data handed to `IdeModalContainerComponent` through `DIALOG_DATA`.
---
# IdeModalContainerData

`interface`

Normalized data handed to `IdeModalContainerComponent` through `DIALOG_DATA`.
`IdeModalService` resolves every default before opening the dialog so the
container stays purely presentational.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `bodyStyle?` | `Record<string, string>` |  |
| `closable` | `boolean` |  |
| `componentParams?` | `Record<string, unknown>` |  |
| `content?` | `string | Type<C>` |  |
| `footer` | `IdeModalButton<C>[]` |  |
| `title?` | `string` |  |
| `titleId` | `string` | DOM id set on the title element and referenced by the dialog's `aria-labelledby`. |
