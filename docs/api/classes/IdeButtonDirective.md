---
title: IdeButtonDirective
description: Styling primitive that replaces ng-zorro's `nz-button`.
---
# IdeButtonDirective

`class`

Styling primitive that replaces ng-zorro's `nz-button`.

Applied as an attribute on native `<button>` and `<a>` elements, it gives them
the compact, dark-friendly look of the IDE toolbar while leaving click, focus
and navigation behaviour to the native element. Existing content (icons,
labels, SVG) is untouched because the directive only decorates the host, and
ng-zorro's `nz`-prefixed inputs are renamed to plain names (`nzType` ->
`type`, `nzSize` -> `size`).

The look is delivered as a single stylesheet injected into the document head
the first time any `[ideButton]` is created, so consumers do not need to
import a global stylesheet.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `size (readonly)` | `InputSignal<IdeButtonSize>` | Height/padding scale of the button (replaces ng-zorro's `nzSize`). |
| `type (readonly)` | `InputSignal<IdeButtonType>` | Visual style of the button (replaces ng-zorro's `nzType`). |
