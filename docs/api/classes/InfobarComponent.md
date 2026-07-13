---
title: InfobarComponent
---
# InfobarComponent

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `activeContainerIndex` | `number` | Index of the active container |
| `activeContainerView?` | `IView` | Current active view of the `activeContainer`. |
| `activeContainerViews` | `IView[]` | Views of the `activeContainer`. |
| `containers` | `InfobarContainer[]` | Containers to display inside the infobar. |
| `size` | `number` | Current size of the infobar |
| `sizeChange` | `EventEmitter<number>` |  |
| `isEmpty` | `unknown` |  |

## `ngOnDestroy()`

## Signature

```typescript
ngOnDestroy(): void
```

### Returns

`void`

## `ngOnInit()`

## Signature

```typescript
ngOnInit(): void
```

### Returns

`void`

## `setActiveContainer()`

## Signature

```typescript
setActiveContainer(container: InfobarContainer): void
```

### Parameters

- `container` (`InfobarContainer`)

### Returns

`void`

## `setActiveView()`

## Signature

```typescript
setActiveView(activeId: string): void
```

### Parameters

- `activeId` (`string`)

### Returns

`void`
