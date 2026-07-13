---
title: PreviewService
---
# PreviewService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `"workbench.contrib.preview-service"` | Unique identifier of the contribution. |

## `canHandle()`

## Signature

```typescript
canHandle(uri: Uri): boolean
```

### Parameters

- `uri` (`Uri`)

### Returns

`boolean`

## `deactivate()`

## Signature

```typescript
deactivate(): void
```

### Returns

`void`

## `handle()`

## Signature

```typescript
handle(uri: Uri): Promise<Preview>
```

### Parameters

- `uri` (`Uri`)

### Returns

`Promise<Preview>`

## `register()`

## Signature

```typescript
register(...handlers: PreviewHandler[]): void
```

### Parameters

- `...handlers` (`PreviewHandler[]`)

### Returns

`void`
