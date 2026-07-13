---
title: ContextMenuService
description: Opens a menu at the pointer position, on top of `@angular/cdk`.
---
# ContextMenuService

`class`

Opens a menu at the pointer position, on top of `@angular/cdk`.

Replacement for ng-zorro's `NzContextMenuService`: swap
`contextMenuService.create(event, dropdown)` for
`contextMenuService.open(event, menu)`, where `menu` is a `TemplateRef`
(an `<ng-template>` wrapping an `IdeMenuComponent`) instead of an
`<nz-dropdown-menu>`.

The rendered menu is a real CDK popup menu: it registers on a private
MenuStack, so selecting an item, pressing Escape/Tab or clicking
outside all close it. Teardown is deferred to a microtask so an item's own
`(click)` runs to completion before its view is destroyed.

## `close()`

## Signature

```typescript
close(): void
```

### Returns

`void`

## `open()`

## Signature

```typescript
open(event: MouseEvent, menu: IdeContextMenuContent, config: IdeContextMenuConfig): OverlayRef
```

### Parameters

- `event` (`MouseEvent`) - Pointer event whose `clientX`/`clientY` anchor the menu.
- `menu` (`IdeContextMenuContent`) - The menu template to render.
- `config` (`IdeContextMenuConfig`) - Optional behaviour overrides.

### Returns

`OverlayRef`
