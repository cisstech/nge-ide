---
title: IContribution
---
# IContribution

`interface`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `string` | Unique identifier of the contribution. |

## `activate()`

## Signature

```typescript
activate(injector: Injector): void | Promise<void>
```

### Parameters

- `injector` (`Injector`) - An injector to use for injecting tokens.

### Returns

`void | Promise<void>`

## `deactivate()`

## Signature

```typescript
deactivate(): void | Promise<void>
```

### Returns

`void | Promise<void>`
