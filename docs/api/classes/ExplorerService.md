---
title: ExplorerService
description: Provides an API to interact with the explorer view tree.
---
# ExplorerService

`class`

Provides an API to interact with the explorer view tree.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `adapter (readonly)` | `ITreeAdapter<IFile>` |  |
| `id (readonly)` | `"workbench.contrib.explorer-service"` | Unique identifier of the contribution. |
| `root (readonly)` | `Observable<IFile[]>` |  |
| `fileNestingPatterns` | `unknown` |  |
| `onDidContextMenu` | `unknown` |  |
| `tree` | `unknown` |  |

## `canCopy()`

## Signature

```typescript
canCopy(): boolean
```

### Returns

`boolean`

## `canCreateFile()`

## Signature

```typescript
canCreateFile(): boolean
```

### Returns

`boolean`

## `canDelete()`

## Signature

```typescript
canDelete(): boolean
```

### Returns

`boolean`

## `canDownload()`

## Signature

```typescript
canDownload(): boolean
```

### Returns

`boolean`

## `canEdit()`

## Signature

```typescript
canEdit(): boolean
```

### Returns

`boolean`

## `canPaste()`

## Signature

```typescript
canPaste(): boolean
```

### Returns

`boolean`

## `canUpload()`

## Signature

```typescript
canUpload(): boolean
```

### Returns

`boolean`

## `collapse()`

## Signature

```typescript
collapse(node: IFile): void
```

### Parameters

- `node` (`IFile`) - The node to collapse.

### Returns

`void`

## `collapseAll()`

## Signature

```typescript
collapseAll(): void
```

### Returns

`void`

## `copy()`

## Signature

```typescript
copy(): void
```

### Returns

`void`

## `createFile()`

## Signature

```typescript
createFile(): Promise<void>
```

### Returns

`Promise<void>`

## `createFolder()`

## Signature

```typescript
createFolder(): Promise<void>
```

### Returns

`Promise<void>`

## `deactivate()`

## Signature

```typescript
deactivate(): void
```

### Returns

`void`

## `download()`

## Signature

```typescript
download(): void
```

### Returns

`void`

## `expand()`

## Signature

```typescript
expand(node: IFile): void
```

### Parameters

- `node` (`IFile`) - The node to expand.

### Returns

`void`

## `expandAll()`

## Signature

```typescript
expandAll(): void
```

### Returns

`void`

## `focusedNode()`

## Signature

```typescript
focusedNode(): IFile | undefined
```

### Returns

`IFile | undefined`

## `hasSelection()`

## Signature

```typescript
hasSelection(): boolean
```

### Returns

`boolean`

## `listCommands()`

## Signature

```typescript
listCommands(): IExplorerCommand[][]
```

### Returns

`IExplorerCommand[][]`

## `paste()`

## Signature

```typescript
paste(): void
```

### Returns

`void`

## `refresh()`

## Signature

```typescript
refresh(): void
```

### Returns

`void`

## `registerCommands()`

## Signature

```typescript
registerCommands(...commands: (IExplorerCommand | Type<IExplorerCommand>)[]): void
```

### Parameters

- `...commands` (`(IExplorerCommand | Type<IExplorerCommand>)[]`) - The commands to register.

### Returns

`void`

## `registerFileNestingPatterns()`

## Signature

```typescript
registerFileNestingPatterns(...patterns: FileNestingPattern[]): void
```

### Parameters

- `...patterns` (`FileNestingPattern[]`)

### Returns

`void`

## `selections()`

## Signature

```typescript
selections(): IFile[]
```

### Returns

`IFile[]`

## `startEdit()`

## Signature

```typescript
startEdit(): void
```

### Returns

`void`

## `unregisterCommands()`

## Signature

```typescript
unregisterCommands(...ids: string[]): void
```

### Parameters

- `...ids` (`string[]`)

### Returns

`void`

## `unregisterFileNestingPatterns()`

## Signature

```typescript
unregisterFileNestingPatterns(...ids: string[]): void
```

### Parameters

- `...ids` (`string[]`)

### Returns

`void`

## `uploadFiles()`

## Signature

```typescript
uploadFiles(file: File): void
```

### Parameters

- `file` (`File`)

### Returns

`void`
