---
title: ViewGroupComponent
---
# ViewGroupComponent

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `direction` | `"vertical" | "horizontal"` |  |
| `minSize (readonly)` | `5` |  |
| `state` | `State` |  |
| `views` | `IView[]` |  |
| `container` | `unknown` |  |

## `_chevron()`

## Signature

```typescript
_chevron(index: number): string
```

### Parameters

- `index` (`number`)

### Returns

`string`

## `_dragEnd()`

## Signature

```typescript
_dragEnd(data: SplitGutterInteractionEvent): void
```

### Parameters

- `data` (`SplitGutterInteractionEvent`)

### Returns

`void`

## `_toggle()`

## Signature

```typescript
_toggle(index: number): void
```

### Parameters

- `index` (`number`)

### Returns

`void`
