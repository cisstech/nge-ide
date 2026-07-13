---
title: EditorGroup
description: Represents an editor group.
---
# EditorGroup

`class`

Represents an editor group.

An editor group is a container for editors. It is responsible for opening and closing editors.
A group can contains only one active editor at a time and on instance of a resource.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `string` | Unique identifier of this group. |
| `activeEditor` | `unknown` |  |
| `activeIndex` | `unknown` |  |
| `activeResource` | `unknown` |  |
| `isEmpty` | `unknown` |  |
| `isInPreviewMode` | `unknown` |  |
| `tabs` | `unknown` |  |

## `close()`

## Signature

```typescript
close(resource: Uri, force?: boolean): Promise<boolean>
```

### Parameters

- `resource` (`Uri`) - the resource to close.
- `force` (`boolean`) - When `true`, force close the resource without asking to save dirty files.

### Returns

`Promise<boolean>`

## `closeAll()`

## Signature

```typescript
closeAll(force?: boolean): Promise<boolean>
```

### Parameters

- `force` (`boolean`) - When `true`, force close the files without asking to save dirty files.

### Returns

`Promise<boolean>`

## `contains()`

## Signature

```typescript
contains(resource: Uri): boolean
```

### Parameters

- `resource` (`Uri`) - the resource.

### Returns

`boolean`

## `containsPreview()`

## Signature

```typescript
containsPreview(resource: Uri): boolean
```

### Parameters

- `resource` (`Uri`) - the resource.

### Returns

`boolean`

## `equals()`

## Signature

```typescript
equals(o: any): boolean
```

### Parameters

- `o` (`any`)

### Returns

`boolean`

## `findIndex()`

## Signature

```typescript
findIndex(resource: Uri): number
```

### Parameters

- `resource` (`Uri`) - the resource to check the index for.

### Returns

`number`

## `isActive()`

## Signature

```typescript
isActive(resource: Uri): boolean
```

### Parameters

- `resource` (`Uri`) - the resource.

### Returns

`boolean`

## `open()`

## Signature

```typescript
open(resource: Uri, options: OpenOptions): Promise<void>
```

### Parameters

- `resource` (`Uri`) - the resource to open.
- `options` (`OpenOptions`) - options to pass to the editor that will open the resource.

### Returns

`Promise<void>`
