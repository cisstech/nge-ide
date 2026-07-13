---
title: PreviewEditor
description: Represents an editor that is attached to a component.
---
# PreviewEditor

`class`

Represents an editor that is attached to a component.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `string` | unique identifier of the editor |
| `name` | `unknown` |  |
| `onChangeRequest` | `unknown` |  |
| `options` | `unknown` |  |

## `canHandle()`

## Signature

```typescript
canHandle(request: OpenRequest): boolean
```

### Parameters

- `request` (`OpenRequest`) - the request to handle.

### Returns

`boolean`

## `component()`

## Signature

```typescript
component(): Promise<typeof PreviewEditorModule>
```

### Returns

`Promise<typeof PreviewEditorModule>`

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
