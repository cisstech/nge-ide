---
title: IFileSystemProvider
description: The filesystem provider defines what the editor needs to read, write, discover,
---
# IFileSystemProvider

`interface`

The filesystem provider defines what the editor needs to read, write, discover,
and to manage files and folders. It allows extensions to serve files from remote places,
like ftp-servers, and to seamlessly integrate those into the editor.

* *Note 1:* The filesystem provider API works with [uris](#monaco.Uri) and assumes hierarchical
paths, e.g. `foo:/my/path` is a child of `foo:/my/` and a parent of `foo:/my/path/deeper`.
* *Note 2:* The word 'file' is often used to denote all kinds of files, e.g.
folders, regular files.

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `scheme (readonly)` | `string` |  |

## `createDirectory()`

## Signature

```typescript
createDirectory(uri: Uri): void | Promise<void>
```

### Parameters

- `uri` (`Uri`) - The uri of the new directory.

### Returns

`void | Promise<void>`

## `delete()`

## Signature

```typescript
delete(uri: Uri): void | Promise<void>
```

### Parameters

- `uri` (`Uri`) - The resource that is to be deleted.

### Returns

`void | Promise<void>`

## `hasCapability()`

## Signature

```typescript
hasCapability(capability: FileSystemProviderCapabilities): boolean
```

### Parameters

- `capability` (`FileSystemProviderCapabilities`)

### Returns

`boolean`

## `move()`

## Signature

```typescript
move(source: Uri, destination: Uri, options: object): void | Promise<void>
```

### Parameters

- `source` (`Uri`) - The existing file.
- `destination` (`Uri`) - The destination location.
- `options` (`object`) - Defines if existing files should be copied.

### Returns

`void | Promise<void>`

## `read()`

## Signature

```typescript
read(uri: Uri): string | Promise<string>
```

### Parameters

- `uri` (`Uri`) - The uri of the file.

### Returns

`string | Promise<string>`

## `readDirectory()`

## Signature

```typescript
readDirectory(uri: Uri): IFile[] | Promise<IFile[]>
```

### Parameters

- `uri` (`Uri`) - The uri of the directory.

### Returns

`IFile[] | Promise<IFile[]>`

## `rename()`

## Signature

```typescript
rename(uri: Uri, name: string): void | Promise<void>
```

### Parameters

- `uri` (`Uri`) - The existing file.
- `name` (`string`) - The new location.

### Returns

`void | Promise<void>`

## `search()`

## Signature

```typescript
search(uri: Uri, form: SearchForm): Promise<SearchResult<Uri>[]>
```

### Parameters

- `uri` (`Uri`)
- `form` (`SearchForm`)

### Returns

`Promise<SearchResult<Uri>[]>`

## `stat()`

## Signature

```typescript
stat(uri: Uri): Promise<IFile>
```

### Parameters

- `uri` (`Uri`) - The uri of the file.

### Returns

`Promise<IFile>`

## `upload()`

## Signature

```typescript
upload(file: File, destination: Uri): void | Promise<void>
```

### Parameters

- `file` (`File`) - The file object to upload.
- `destination` (`Uri`) - The uri where the file should be uploaded.

### Returns

`void | Promise<void>`

## `write()`

## Signature

```typescript
write(uri: Uri, content: string, update: boolean): void | Promise<void>
```

### Parameters

- `uri` (`Uri`) - The uri of the file.
- `content` (`string`) - The new content of the file.
- `update` (`boolean`) - Updates the content of the file instead of created a new file.

### Returns

`void | Promise<void>`
