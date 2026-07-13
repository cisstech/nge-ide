---
title: NotificationService
---
# NotificationService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `"workbench.contrib.notification-service"` | Unique identifier of the contribution. |
| `count` | `unknown` |  |
| `isEmpty` | `unknown` |  |
| `items` | `unknown` |  |

## `clear()`

## Signature

```typescript
clear(): void
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

## `publish()`

## Signature

```typescript
publish(notification: Notification): void
```

### Parameters

- `notification` (`Notification`)

### Returns

`void`

## `publishError()`

## Signature

```typescript
publishError(err: any): void
```

### Parameters

- `err` (`any`)

### Returns

`void`
