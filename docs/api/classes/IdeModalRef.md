---
title: IdeModalRef
description: Handle to a modal opened through `IdeModalService`. Wraps the CDK `DialogRef`
---
# IdeModalRef

`class`

Handle to a modal opened through `IdeModalService`. Wraps the CDK `DialogRef`
and exposes the small surface the IDE relies on from an `NzModalRef`: an
`afterClose` stream and a `close(result?)` method.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `afterClose (readonly)` | `Observable<R | undefined>` | Emits the result once, right after the modal has closed. Replaces |
| `id` | `unknown` |  |

## `close()`

## Signature

```typescript
close(result?: R): void
```

### Parameters

- `result` (`R`)

### Returns

`void`
