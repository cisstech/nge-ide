---
title: CodeEditor
description: Represents an editor that is attached to a component.
---
# CodeEditor

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
canHandle(request: OpenRequest): Promise<boolean>
```

### Parameters

- `request` (`OpenRequest`) - the request to handle.

### Returns

`Promise<boolean>`

## `component()`

## Signature

```typescript
component(): Promise<typeof CodeEditorModule>
```

### Returns

`Promise<typeof CodeEditorModule>`

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
