---
title: FileService
---
# FileService

`class`

## Properties

| Name | Type | Description |
| --- | --- | --- |
| `id (readonly)` | `"workbench.contrib.file-service"` | Unique identifier of the contribution. |
| `onDidChangeFile (readonly)` | `Observable<IFileChange[]>` | Emitted after creating/updating/deleting a file. |
| `onDidCloseFile (readonly)` | `Observable<Uri>` | Emitted after closing a file. |
| `onDidRefresh (readonly)` | `Observable<void>` | Emitted after refreshing the files.. |
| `onDidSaveFile (readonly)` | `Observable<Uri>` | Emitted after saving a file. |
| `onWillChangeFile (readonly)` | `Observable<IFileChange[]>` | Emitted before creating/updating/deleting a file. |
| `onWillCloseFile (readonly)` | `Observable<Uri>` | Emitted before closing a file. |
| `onWillRefresh (readonly)` | `Observable<void>` | Emitted before refreshing the files. |
| `onWillSaveFile (readonly)` | `Observable<Uri>` | Emitted before saving a file. |
| `treeChange (readonly)` | `Observable<IFile[]>` |  |

## `canHandle()`

## Signature

```typescript
canHandle(uri: Uri): boolean
```

### Parameters

- `uri` (`Uri`) - monaco.Uri to test.

### Returns

`boolean`

## `close()`

## Signature

```typescript
close(uri: Uri): Promise<void>
```

### Parameters

- `uri` (`Uri`)

### Returns

`Promise<void>`

## `contentChange()`

## Signature

```typescript
contentChange(uri: Uri): Observable<IContent | undefined>
```

### Parameters

- `uri` (`Uri`) - The URI of the file.

### Returns

`Observable<IContent | undefined>`

## `copy()`

## Signature

```typescript
copy(source: IFile[], destination: IFile): Promise<void>
```

### Parameters

- `source` (`IFile[]`)
- `destination` (`IFile`)

### Returns

`Promise<void>`

## `createDirectory()`

## Signature

```typescript
createDirectory(parent: IFile, dirName: string): Promise<void>
```

### Parameters

- `parent` (`IFile`)
- `dirName` (`string`)

### Returns

`Promise<void>`

## `createFile()`

## Signature

```typescript
createFile(parent: IFile, fileName: string): Promise<void>
```

### Parameters

- `parent` (`IFile`)
- `fileName` (`string`)

### Returns

`Promise<void>`

## `deactivate()`

## Signature

```typescript
deactivate(): void
```

### Returns

`void`

## `delete()`

## Signature

```typescript
delete(entry: IFile): Promise<void>
```

### Parameters

- `entry` (`IFile`)

### Returns

`Promise<void>`

## `deleteAll()`

## Signature

```typescript
deleteAll(entries: IFile[]): Promise<void>
```

### Parameters

- `entries` (`IFile[]`)

### Returns

`Promise<void>`

## `emitTreeChange()`

## Signature

```typescript
emitTreeChange(): void
```

### Returns

`void`

## `entryId()`

## Signature

```typescript
entryId(uri: Uri): string
```

### Parameters

- `uri` (`Uri`)

### Returns

`string`

## `entryName()`

## Signature

```typescript
entryName(uri: Uri): string
```

### Parameters

- `uri` (`Uri`) - The URI for which to get the entry name.

### Returns

`string`

## `find()`

## Signature

```typescript
find(uri: Uri): Promise<IFile | undefined>
```

### Parameters

- `uri` (`Uri`) - The uri to find.

### Returns

`Promise<IFile | undefined>`

## `findAll()`

## Signature

```typescript
findAll(predicate: FilePredicate): IFile[]
```

### Parameters

- `predicate` (`FilePredicate`) - The predicate to filter the files.

### Returns

`IFile[]`

## `findChildren()`

## Signature

```typescript
findChildren(entry: IFile): IFile[]
```

### Parameters

- `entry` (`IFile`) - The entry to find its children.

### Returns

`IFile[]`

## `getProvider()`

## Signature

```typescript
getProvider(scheme: string): T | undefined
```

### Parameters

- `scheme` (`string`)

### Returns

`T | undefined`

## `hasCapability()`

## Signature

```typescript
hasCapability(uri: Uri, capability: FileSystemProviderCapabilities): boolean
```

### Parameters

- `uri` (`Uri`) - monaco.Uri to test.
- `capability` (`FileSystemProviderCapabilities`) - The required capability.

### Returns

`boolean`

## `hasCapabilityForAnyProvider()`

## Signature

```typescript
hasCapabilityForAnyProvider(capability: FileSystemProviderCapabilities): boolean
```

### Parameters

- `capability` (`FileSystemProviderCapabilities`)

### Returns

`boolean`

## `hasProvider()`

## Signature

```typescript
hasProvider(scheme: string): boolean
```

### Parameters

- `scheme` (`string`)

### Returns

`boolean`

## `isAncestor()`

## Signature

```typescript
isAncestor(uri: Uri, candidate: Uri): boolean
```

### Parameters

- `uri` (`Uri`) - The uri to test.
- `candidate` (`Uri`) - The candidate to test.

### Returns

`boolean`

## `isDirty()`

## Signature

```typescript
isDirty(uri?: Uri): boolean
```

### Parameters

- `uri` (`Uri`) - An optional uri to test.

### Returns

`boolean`

## `isParent()`

## Signature

```typescript
isParent(uri: Uri, candidate: Uri): boolean
```

### Parameters

- `uri` (`Uri`) - The uri to test.
- `candidate` (`Uri`) - The candidate to test.

### Returns

`boolean`

## `isRoot()`

## Signature

```typescript
isRoot(uri: Uri): boolean
```

### Parameters

- `uri` (`Uri`) - The uri to test.

### Returns

`boolean`

## `listProviders()`

## Signature

```typescript
listProviders(): readonly IFileSystemProvider[]
```

### Returns

`readonly IFileSystemProvider[]`

## `move()`

## Signature

```typescript
move(source: IFile, destination: IFile): Promise<void>
```

### Parameters

- `source` (`IFile`)
- `destination` (`IFile`)

### Returns

`Promise<void>`

## `normalize()`

## Signature

```typescript
normalize(entries: IFile[]): IFile[]
```

### Parameters

- `entries` (`IFile[]`) - The entries to normalize.

### Returns

`IFile[]`

## `open()`

## Signature

```typescript
open(uri: Uri): Promise<IContent>
```

### Parameters

- `uri` (`Uri`) - The URI of the file to open.

### Returns

`Promise<IContent>`

## `readFile()`

## Signature

```typescript
readFile(uri: Uri): Promise<string>
```

### Parameters

- `uri` (`Uri`)

### Returns

`Promise<string>`

## `refresh()`

## Signature

```typescript
refresh(): Promise<void>
```

### Returns

`Promise<void>`

## `registerFolders()`

## Signature

```typescript
registerFolders(...folders: IFolder[]): Promise<void>
```

### Parameters

- `...folders` (`IFolder[]`) - The folders to register.

### Returns

`Promise<void>`

## `registerFolderSorter()`

## Signature

```typescript
registerFolderSorter(sorter: (a: IFolder, b: IFolder) => number): void
```

### Parameters

- `sorter` (`(a: IFolder, b: IFolder) => number`) - The sorter function.

### Returns

`void`

## `registerNameProvider()`

## Signature

```typescript
registerNameProvider(provider: (uri: Uri) => string): void
```

### Parameters

- `provider` (`(uri: Uri) => string`) - The name provider function.

### Returns

`void`

## `registerProvider()`

## Signature

```typescript
registerProvider(provider: IFileSystemProvider): void
```

### Parameters

- `provider` (`IFileSystemProvider`) - The file system provider that should be registered.

### Returns

`void`

## `rename()`

## Signature

```typescript
rename(entry: IFile, newName: string): Promise<void>
```

### Parameters

- `entry` (`IFile`)
- `newName` (`string`)

### Returns

`Promise<void>`

## `replaceFolder()`

## Signature

```typescript
replaceFolder(oldUri: Uri, newFolder: IFolder): Promise<void>
```

### Parameters

- `oldUri` (`Uri`) - The URI of the folder to be replaced.
- `newFolder` (`IFolder`) - The new folder object.

### Returns

`Promise<void>`

## `save()`

## Signature

```typescript
save(uri: Uri): Promise<void>
```

### Parameters

- `uri` (`Uri`) - monaco.Uri to save.

### Returns

`Promise<void>`

## `search()`

## Signature

```typescript
search(form: SearchForm): Promise<SearchResult<Uri>[]>
```

### Parameters

- `form` (`SearchForm`) - The search form.

### Returns

`Promise<SearchResult<Uri>[]>`

## `unregisterFolders()`

## Signature

```typescript
unregisterFolders(...uris: Uri[]): void
```

### Parameters

- `...uris` (`Uri[]`) - The URIs of the folders to unregister.

### Returns

`void`

## `update()`

## Signature

```typescript
update(uri: Uri, content: string): void
```

### Parameters

- `uri` (`Uri`) - The URI of the file to update.
- `content` (`string`) - The new content of the file.

### Returns

`void`

## `upload()`

## Signature

```typescript
upload(file: File, destination: IFile): Promise<void>
```

### Parameters

- `file` (`File`)
- `destination` (`IFile`)

### Returns

`Promise<void>`

## `writeFile()`

## Signature

```typescript
writeFile(uri: Uri, content: string): Promise<void>
```

### Parameters

- `uri` (`Uri`)
- `content` (`string`)

### Returns

`Promise<void>`
