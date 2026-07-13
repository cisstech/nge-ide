---
title: IdeMenuTriggerDirective
description: Turns its host element into a click trigger that opens an
---
# IdeMenuTriggerDirective

`class`

Turns its host element into a click trigger that opens an
[IdeMenuComponent](/docs/api/classes/IdeMenuComponent) declared in an `<ng-template>`.

Replacement for ng-zorro's `nz-dropdown` + `[nzDropdownMenu]`. It composes
CDK's `cdkMenuTriggerFor` through a host directive: clicking toggles the menu,
arrow keys open it, `aria-haspopup` / `aria-expanded` are kept in sync and the
menu closes on outside click, Escape or selection.

ng-zorro bindings are renamed:
- `[nzDropdownMenu]="menu"` becomes `[ideMenuTriggerFor]="menu"`, where `menu`
  is a `TemplateRef` (an `<ng-template>`) rather than an `<nz-dropdown-menu>`.
