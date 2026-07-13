---
title: IStatusBarItem
---
# IStatusBarItem

`interface`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `active` | `Observable<boolean>` |  |
| `content` | `Observable<string>` |  |
| `id (readonly)` | `string` |  |
| `priority?` | `number` |  |
| `side (readonly)` | `"left" | "right"` |  |
| `tooltip? (readonly)` | `string` |  |

## `action()`

## Signature

```typescript
action(): void | Promise<void>
```

### Returns

`void | Promise<void>`
