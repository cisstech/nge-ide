---
title: IdeModalService
description: Injectable, VS-Code-like modal service built on `@angular/cdk/dialog`. It is a
---
# IdeModalService

`class`

Injectable, VS-Code-like modal service built on `@angular/cdk/dialog`. It is a
drop-in replacement for ng-zorro's `NzModalService` for the surface the IDE
relies on: `create`/`open` take plain (un-prefixed) options and return an
[IdeModalRef](/docs/api/classes/IdeModalRef) exposing `afterClose` and `close(result)`.

Body content may be a string (rendered as sanitized HTML) or a component type
with `componentParams`, matching `nzContent` + `nzComponentParams`.

## `create()`

## Signature

```typescript
create(options: IdeModalOptions<C>): IdeModalRef<R>
```

### Parameters

- `options` (`IdeModalOptions<C>`)

### Returns

`IdeModalRef<R>`

## `open()`

## Signature

```typescript
open(options: IdeModalOptions<C>): IdeModalRef<R>
```

### Parameters

- `options` (`IdeModalOptions<C>`)

### Returns

`IdeModalRef<R>`
