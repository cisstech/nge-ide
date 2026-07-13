---
title: IdeModalButton
description: Declarative footer button of a modal, mirroring the plain objects the IDE
---
# IdeModalButton

`interface`

Declarative footer button of a modal, mirroring the plain objects the IDE
passes to ng-zorro's `nzFooter`. Every `nz`-prefixed field is renamed to its
plain form: `label`, an optional `type`/`danger` for styling, `disabled`, and
an `onClick` handler.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `danger?` | `boolean` | Renders the destructive (danger) styling. Replaces ng-zorro's `danger`. |
| `disabled?` | `boolean` | Whether the button is disabled and non-interactive. |
| `label` | `string` | Text rendered inside the button. |
| `onClick?` | `(contentComponentInstance: C) => void` | Invoked when the button is activated. Clicking never dismisses the modal on |
| `type?` | `IdeModalButtonType` | Visual style; `'primary'` renders the accent button. Replaces the button's `type`. |
