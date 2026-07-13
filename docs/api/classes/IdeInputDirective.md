---
title: IdeInputDirective
description: Styling primitive that replaces ng-zorro's `nz-input`.
---
# IdeInputDirective

`class`

Styling primitive that replaces ng-zorro's `nz-input`.

Applied as an attribute on native `<input>` and `<textarea>` elements, it
gives them the compact, dark-friendly look of the IDE while leaving value
handling entirely to Angular's built-in value accessors. Because it adds no
`ControlValueAccessor` of its own it stays fully compatible with `[(ngModel)]`
(including `type="number"`), `formControl`, and reactive forms.

The look is delivered as a single stylesheet injected into the document head
the first time any `[ideInput]` control is created, so consumers do not need
to import a global stylesheet.
