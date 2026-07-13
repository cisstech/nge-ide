---
title: IdeMenuItemDirective
description: A single entry inside an IdeMenuComponent.
---
# IdeMenuItemDirective

`class`

A single entry inside an [IdeMenuComponent](/docs/api/classes/IdeMenuComponent).

Replacement for ng-zorro's `<li nz-menu-item>`. It composes CDK's `cdkMenuItem`
through a host directive, so the item is focusable, exposes `role="menuitem"`,
activates on Enter/Space and closes the menu once triggered. Any `(click)`
handler the consumer already put on the element keeps firing as before.

ng-zorro inputs are renamed to plain names:
- `nzDisabled` becomes `disabled`
