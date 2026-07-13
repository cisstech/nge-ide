---
title: IdeService
---
# IdeService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `started (readonly)` | `Observable<boolean>` |  |

## `onAfterStart()`

## Signature

```typescript
onAfterStart(observer: Observer<void>): Subscription
```

### Parameters

- `observer` (`Observer<void>`) - Subcription function.

### Returns

`Subscription`

## `onBeforeStop()`

## Signature

```typescript
onBeforeStop(observer: Observer<void>): Subscription
```

### Parameters

- `observer` (`Observer<void>`) - Subcription function.

### Returns

`Subscription`

## `start()`

## Signature

```typescript
start(): Promise<void>
```

### Returns

`Promise<void>`

## `stop()`

## Signature

```typescript
stop(): Promise<void>
```

### Returns

`Promise<void>`
