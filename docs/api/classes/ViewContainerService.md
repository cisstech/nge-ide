---
title: ViewContainerService
---
# ViewContainerService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `"workbench.contrib.view-container"` | Unique identifier of the contribution. |

## `consumeArgs()`

## Signature

```typescript
consumeArgs(containerId: string): Record<string, any> | undefined
```

### Parameters

- `containerId` (`string`)

### Returns

`Record<string, any> | undefined`

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
list(scope: ViewContainerScopes): Observable<T[]>
```

### Parameters

- `scope` (`ViewContainerScopes`) - Scope to filter.

### Returns

`Observable<T[]>`

## `onDidOpen()`

## Signature

```typescript
onDidOpen(...containerIds: string[]): Observable<string>
```

### Parameters

- `...containerIds` (`string[]`)

### Returns

`Observable<string>`

## `open()`

## Signature

```typescript
open(containerId: string, args?: Record<string, any>): void
```

### Parameters

- `containerId` (`string`)
- `args` (`Record<string, any>`)

### Returns

`void`

## `register()`

## Signature

```typescript
register(...containers: IViewContainer[]): void
```

### Parameters

- `...containers` (`IViewContainer[]`) - Containers to register.

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
