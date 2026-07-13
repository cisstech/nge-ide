---
title: StatusBarService
---
# StatusBarService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `"workbench.contrib.status-bar-service"` | Unique identifier of the contribution. |

## `deactivate()`

## Signature

```typescript
deactivate(): void
```

### Returns

`void`

## `list()`

## Signature

```typescript
list(): Observable<IStatusBarItem[]>
```

### Returns

`Observable<IStatusBarItem[]>`

## `register()`

## Signature

```typescript
register(...statusbar: IStatusBarItem[]): void
```

### Parameters

- `...statusbar` (`IStatusBarItem[]`)

### Returns

`void`
