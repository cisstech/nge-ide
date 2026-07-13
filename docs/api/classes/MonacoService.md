---
title: MonacoService
---
# MonacoService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `activeEditorChange (readonly)` | `Observable<Nullable<IStandaloneCodeEditor>>` | Emitted when active editor change. |
| `activeLangageChange (readonly)` | `Observable<Nullable<string>>` | Emitted when active editor language change. |
| `cursorChange (readonly)` | `Observable<Nullable<IPosition>>` | Emitted when active editor cursor position change. |
| `id (readonly)` | `"workbench.contrib.code-editor-service"` | Unique identifier of the contribution. |
| `onDidCreateEditor (readonly)` | `Observable<IStandaloneCodeEditor>` | Emitted when a new editor is created |
| `onDidFollowLink (readonly)` | `Observable<object>` | Emitted when a link is clicked inside the editor |
| `activeEditor` | `unknown` |  |
| `activeLanguage` | `unknown` |  |
| `cursor` | `unknown` |  |

## `activate()`

## Signature

```typescript
activate(): Promise<void>
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

## `findLanguage()`

## Signature

```typescript
findLanguage(uri: Uri): string
```

### Parameters

- `uri` (`Uri`)

### Returns

`string`

## `onCreateEditor()`

## Signature

```typescript
onCreateEditor(editor: IStandaloneCodeEditor): void
```

### Parameters

- `editor` (`IStandaloneCodeEditor`)

### Returns

`void`

## `onDisposeEditor()`

## Signature

```typescript
onDisposeEditor(editor: IStandaloneCodeEditor): void
```

### Parameters

- `editor` (`IStandaloneCodeEditor`)

### Returns

`void`

## `open()`

## Signature

```typescript
open(options: object): Promise<void>
```

### Parameters

- `options` (`object`)

### Returns

`Promise<void>`
