---
title: EditorService
---
# EditorService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `commands (readonly)` | `Observable<ICommand[]>` |  |
| `editorGroups (readonly)` | `Observable<EditorGroup[]>` | Opened editor groups. |
| `id (readonly)` | `"workbench.contrib.editor-service"` | Unique identifier of the contribution. |
| `onDidOpen (readonly)` | `Observable<Uri>` | Emitted after opening a resource. |
| `onWillOpen (readonly)` | `Observable<Uri>` | Emitted before opening a resource. |
| `state (readonly)` | `Observable<EditorState>` | State of the editor. |
| `activeEditor` | `unknown` |  |
| `activeGroup` | `unknown` |  |
| `activeResource` | `unknown` |  |
| `dropHandlers` | `unknown` |  |
| `visibleEditors` | `unknown` |  |

## `activate()`

## Signature

```typescript
activate(): void
```

### Returns

`void`

## `close()`

## Signature

```typescript
close(resource: Uri, force?: boolean): Promise<any>
```

### Parameters

- `resource` (`Uri`) - the resource to close.
- `force` (`boolean`) - When `true`, force close the resource without asking to save it if it is dirty.

### Returns

`Promise<any>`

## `closeAll()`

## Signature

```typescript
closeAll(force?: boolean): Promise<void>
```

### Parameters

- `force` (`boolean`) - When `true`, force close the resources without asking to save the dirty ones.

### Returns

`Promise<void>`

## `deactivate()`

## Signature

```typescript
deactivate(): void
```

### Returns

`void`

## `findGroup()`

## Signature

```typescript
findGroup(predicate: Predicate<EditorGroup>): EditorGroup | undefined
```

### Parameters

- `predicate` (`Predicate<EditorGroup>`) - the predicate to test.

### Returns

`EditorGroup | undefined`

## `findGroupById()`

## Signature

```typescript
findGroupById(id: string): EditorGroup | undefined
```

### Parameters

- `id` (`string`) - the id of the group

### Returns

`EditorGroup | undefined`

## `findGroups()`

## Signature

```typescript
findGroups(predicate: Predicate<EditorGroup>): EditorGroup[]
```

### Parameters

- `predicate` (`Predicate<EditorGroup>`) - the predicate to test.

### Returns

`EditorGroup[]`

## `isActiveGroup()`

## Signature

```typescript
isActiveGroup(group: EditorGroup): boolean
```

### Parameters

- `group` (`EditorGroup`) - the group.

### Returns

`boolean`

## `isOpened()`

## Signature

```typescript
isOpened(resource: Uri): boolean
```

### Parameters

- `resource` (`Uri`) - The resource to test.

### Returns

`boolean`

## `open()`

## Signature

```typescript
open(resource: Uri, options?: Partial<OpenOptions>): Promise<boolean>
```

### Parameters

- `resource` (`Uri`) - The resource to open.
- `options` (`Partial<OpenOptions>`) - Open options.

### Returns

`Promise<boolean>`

## `registerCommands()`

## Signature

```typescript
registerCommands(...commands: (ICommand | Type<ICommand>)[]): void
```

### Parameters

- `...commands` (`(ICommand | Type<ICommand>)[]`) - the commands to register.

### Returns

`void`

## `registerDropInEditorHandler()`

## Signature

```typescript
registerDropInEditorHandler(handler: DropIntoEditorHandler): void
```

### Parameters

- `handler` (`DropIntoEditorHandler`) - the handler to register.

### Returns

`void`

## `registerEditors()`

## Signature

```typescript
registerEditors(...editors: Editor[]): void
```

### Parameters

- `...editors` (`Editor[]`) - Editors to register.

### Returns

`void`

## `saveActiveResource()`

## Signature

```typescript
saveActiveResource(): Promise<void>
```

### Returns

`Promise<void>`

## `saveAll()`

## Signature

```typescript
saveAll(): Promise<any>
```

### Returns

`Promise<any>`

## `setActiveGroup()`

## Signature

```typescript
setActiveGroup(group: EditorGroup): void
```

### Parameters

- `group` (`EditorGroup`) - the group to focus.

### Returns

`void`
