---
title: TaskService
---
# TaskService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `current (readonly)` | `Observable<ITask | undefined>` |  |
| `id (readonly)` | `"workbench.contrib.task-service"` | Unique identifier of the contribution. |

## `activate()`

## Signature

```typescript
activate(): void
```

### Returns

`void`

## `deactivate()`

## Signature

```typescript
deactivate(): void
```

### Returns

`void`

## `run()`

## Signature

```typescript
run(text: string): ITask
```

### Parameters

- `text` (`string`)

### Returns

`ITask`
