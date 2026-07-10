# File system

The IDE never talks to a disk directly. It talks to the `FileService`, which
routes every operation to a **file system provider** chosen by the resource's URI
scheme. Registering a provider is how you decide where files come from: memory,
an HTTP API, `IndexedDB`, a git host, anything you can wrap.

## The provider contract

A provider extends `FileSystemProvider` (or implements `IFileSystemProvider`). It
declares a `scheme`, a set of `capabilities`, and the operations it supports:

```ts
import { FileSystemProvider, FileSystemProviderCapabilities, FileSystemError, IFile } from '@cisstech/nge-ide/core'
import { firstValueFrom } from 'rxjs'

export class HttpFileSystemProvider extends FileSystemProvider {
  readonly scheme = 'http'
  readonly capabilities = FileSystemProviderCapabilities.FileRead

  constructor(private readonly http: HttpClient) {
    super()
  }

  override async stat(uri: monaco.Uri): Promise<IFile> {
    const meta = await firstValueFrom(this.http.get<{ isDirectory: boolean; name: string }>(apiUrl(uri)))
    return { uri, isFolder: meta.isDirectory, readOnly: true, name: meta.name }
  }

  override async readDirectory(uri: monaco.Uri): Promise<IFile[]> {
    /* return the children as IFile[] */
  }

  override async read(uri: monaco.Uri): Promise<string> {
    return firstValueFrom(this.http.get(apiUrl(uri), { responseType: 'text' }))
  }
}
```

The base class implements every operation as "not supported", so you only
override what your storage can actually do. Throw `FileSystemError` (for example
`FileSystemError.FileNotFound(uri)`) to report failures the IDE understands.

## Capabilities

`capabilities` is a bit mask that tells the IDE what the provider can do, so it
can enable or hide the matching actions (rename, delete, upload, search…):

| Capability   | Enables                              |
| ------------ | ------------------------------------ |
| `FileRead`   | opening and reading files            |
| `FileWrite`  | saving edits, creating files/folders |
| `FileDelete` | deleting entries                     |
| `FileMove`   | renaming and moving                  |
| `FileUpload` | uploading from the host              |
| `FileSearch` | the Search view (see below)          |
| `FileStat`   | reading metadata                     |

Combine them with a bitwise OR:

```ts
readonly capabilities =
  FileSystemProviderCapabilities.FileRead |
  FileSystemProviderCapabilities.FileWrite |
  FileSystemProviderCapabilities.FileDelete
```

The **Search** view (`@cisstech/nge-ide/search`) only appears when a registered
provider advertises `FileSearch` and implements `search`.

## Register it

Register the provider, then declare the root folders to show in the explorer,
usually once the IDE has started:

```ts
this.ide.onAfterStart(() => {
  this.fileService.registerProvider(new HttpFileSystemProvider(this.http))
  this.fileService.registerFolders({
    name: 'My project',
    uri: monaco.Uri.parse('http://my-project/'),
  })
})
```

## The in-memory provider

`MemFileProvider` is a complete reference implementation (scheme `inmemory`,
every capability) that seeds a small tree. It is meant for demos and tests, and
it is the clearest example to read when writing your own. See
`MemFileProvider` in the source.

## Working with files

Once a provider is registered, the rest of the app goes through `FileService`:
`open`, `update`, `save`, `createFile`, `createDirectory`, `rename`, `delete`,
`move`, `copy`, `upload`, `search`, plus change streams like `treeChange` and
`onDidSaveFile`. See the [Services reference](/docs/services) for the full list.
