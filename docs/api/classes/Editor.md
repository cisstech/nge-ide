---
title: Editor
description: Represents an editor that is attached to a component.
---
# Editor

`class`

Represents an editor that is attached to a component.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `component (readonly)` | `() => Type<any> | Promise<Type<any>>` |  |
| `id (readonly)` | `string` | unique identifier of the editor |
| `name` | `unknown` |  |
| `onChangeRequest` | `unknown` |  |
| `options` | `unknown` |  |

## `canHandle()`

## Signature

```typescript
canHandle(request: OpenRequest): boolean | Promise<boolean>
```

### Parameters

- `request` (`OpenRequest`) - the request to handle.

### Returns

`boolean | Promise<boolean>`

## `equals()`

## Signature

```typescript
equals(o: any): boolean
```

### Parameters

- `o` (`any`)

### Returns

`boolean`

## `handle()`

## Signature

```typescript
handle(request: OpenRequest): Promise<Editor | undefined>
```

### Parameters

- `request` (`OpenRequest`)

### Returns

`Promise<Editor | undefined>`
