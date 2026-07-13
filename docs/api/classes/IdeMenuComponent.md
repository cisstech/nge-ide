---
title: IdeMenuComponent
description: Menu panel that lays out a list of IdeMenuItemDirective entries.
---
# IdeMenuComponent

`class`

Menu panel that lays out a list of [IdeMenuItemDirective](/docs/api/classes/IdeMenuItemDirective) entries.

Drop-in replacement for ng-zorro's `<ul nz-menu>`. It composes CDK's `cdkMenu`
through a host directive, so the panel is keyboard navigable (arrow keys,
Home/End, type-ahead) and carries the correct `role="menu"` semantics without
any extra wiring.

The panel is meant to live inside an `<ng-template>` that is either referenced
by an [IdeMenuTriggerDirective](/docs/api/classes/IdeMenuTriggerDirective) (click dropdowns) or opened at the
pointer through [ContextMenuService](/docs/api/classes/ContextMenuService) (context menus).

Styling uses `ViewEncapsulation.None` on purpose: the panel and its items are
projected into a CDK overlay that lives outside this component's view, so the
rules are published globally under the `.ide-menu` / `.ide-menu-item` classes.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `theme (readonly)` | `Signal<ResolvedTheme>` |  |
