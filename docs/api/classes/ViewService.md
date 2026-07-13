---
title: ViewService
---
# ViewService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `"workbench.contrib.views"` | Unique identifier of the contribution. |

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
list(viewContainerId: string): Observable<IView[]>
```

### Parameters

- `viewContainerId` (`string`)

### Returns

`Observable<IView[]>`

## `register()`

## Signature

```typescript
register(...views: IView[]): void
```

### Parameters

- `...views` (`IView[]`)

### Returns

`void`

## `registerCommands()`

## Signature

```typescript
registerCommands(...commands: ViewCommand[]): void
```

### Parameters

- `...commands` (`ViewCommand[]`)

### Returns

`void`

## `unregister()`

## Signature

```typescript
unregister(id: string): void
```

### Parameters

- `id` (`string`)

### Returns

`void`

## `unregisterCommands()`

## Signature

```typescript
unregisterCommands(viewId: string, commandId: string): void
```

### Parameters

- `viewId` (`string`)
- `commandId` (`string`)

### Returns

`void`
