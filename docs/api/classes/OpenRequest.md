---
title: OpenRequest
description: Represents file open request.
---
# OpenRequest

`class`

Represents file open request.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `file? (readonly)` | `IFile` | The file associated with the request if any. |
| `injector (readonly)` | `Injector` | Editor scope injector. |
| `options (readonly)` | `OpenOptions` | The options associated with the request. |
| `uri (readonly)` | `Uri` | The uri to open. |

## `equals()`

## Signature

```typescript
equals(o: any): o is OpenRequest
```

### Parameters

- `o` (`any`)

### Returns

`o is OpenRequest`
