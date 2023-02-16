// inspired from vscode api https://code.visualstudio.com/api/references/vscode-api#FileSystem
// tslint:disable: no-bitwise

import { IFile } from './file';
import { SearchForm, SearchResult } from './file-system-search';

/**
 * Possible changes that can occur to a file.
 */
export enum FileChangeType {
  /**
   * A file content has changed.
   */
  Changed = 1,

  /**
   * A file has been created.
   */
  Created = 2,

  /**
   * A file has been deleted.
   */
  Deleted = 3,
}

export enum FileSystemProviderCapabilities {
  FileRead = 1 << 1,
  FileWrite = 1 << 2,
  FileDelete = 1 << 3,
  FileUpload = 1 << 4,
  FileMove = 1 << 5,
  FileSearch = 1 << 6,
}

/**
 * Identifies a single change in a file.
 */
export interface IFileChange {
  /**
   * The type of change that occurred to the file.
   */
  readonly type: FileChangeType;

  /**
   * The unified resource identifier of the file that changed.
   */
  readonly uri: monaco.Uri;
}

/**
 * The filesystem provider defines what the editor needs to read, write, discover,
 * and to manage files and folders. It allows extensions to serve files from remote places,
 * like ftp-servers, and to seamlessly integrate those into the editor.
 *
 * * *Note 1:* The filesystem provider API works with [uris](#monaco.Uri) and assumes hierarchical
 * paths, e.g. `foo:/my/path` is a child of `foo:/my/` and a parent of `foo:/my/path/deeper`.
 * * *Note 2:* The word 'file' is often used to denote all kinds of files, e.g.
 * folders, regular files.
 */
export interface IFileSystemProvider {
  readonly scheme: string;

  /**
   * Checks if the provider for the provided resource has the provided file system capability.
   */
  hasCapability(capability: FileSystemProviderCapabilities): boolean;

  /**
   * Retrieves recursivly all entries of a directory.
   *
   * Note: This method should include the directory itself.
   * @param uri? The uri of the directory.
   * @return  A promise that resolves with a list of {@link IFile}.
   * @throws {@link FileSystemError.FileNotFound} when `uri` doesn't exist.
   */
  readDirectory(uri: monaco.Uri): IFile[] | Promise<IFile[]>;

  /**
   * Create a new directory.
   *
   * @param uri The uri of the new directory.
   * @throws {@link FileSystemError.FileNotFound} when the parent of `uri` doesn't exist.
   * @throws {@link FileSystemError.FileExists} when `uri` already exists.
   * @throws {@link FileSystemError.NoPermissions} when permissions aren't sufficient.
   */
  createDirectory(uri: monaco.Uri): void | Promise<void>;

  /**
   * Read the entire contents of a file.
   *
   * @param uri The uri of the file.
   * @return A promise that resolves with a file content.
   * @throws {@link FileSystemError.FileNotFound} when `uri` doesn't exist.
   */
  read(uri: monaco.Uri): string | Promise<string>;

  /**
   * Write data to a file, replacing its entire contents.
   *
   * @param uri The uri of the file.
   * @param content The new content of the file.
   * @param update Updates the content of the file instead of created a new file.
   * @throws {@link FileSystemError.FileNotFound} when `uri` doesn't exist and `create` is not set.
   * @throws {@link FileSystemError.FileNotFound} when the parent of `uri` doesn't exist and `create` is set, e.g. no mkdirp-logic required.
   * @throws {@link FileSystemError.FileExists} when `uri` already exists, `create` is set but `overwrite` is not set.
   * @throws {@link FileSystemError.NoPermissions} when permissions aren't sufficient.
   */
  write(
    uri: monaco.Uri,
    content: string,
    update: boolean
  ): void | Promise<void>;

  /**
   * Delete a file.
   *
   * @param uri The resource that is to be deleted.
   * @throws {@link FileSystemError.FileNotFound} when `uri` doesn't exist.
   * @throws {@link FileSystemError.NoPermissions} when permissions aren't sufficient.
   */
  delete(uri: monaco.Uri): void | Promise<void>;

  /**
   * Rename a file or folder.
   *
   * @param uri The existing file.
   * @param name The new location.
   * @throws {@link FileSystemError.FileNotFound} when `uri` doesn't exist.
   * @throws {@link FileSystemError.FileNotFound} when parent of the new uri doesn't exist, e.g. no mkdirp-logic required.
   * @throws {@link FileSystemError.FileExists} when `newUri` exists and when the `overwrite` option is not `true`.
   * @throws {@link FileSystemError.NoPermissions} when permissions aren't sufficient.
   */
  rename(uri: monaco.Uri, name: string): void | Promise<void>;

  /**
   * Copy files or folders.
   *
   * @param source The existing file.
   * @param destination The destination location.
   * @param options Defines if existing files should be copied.
   * @throws {@link FileSystemError.FileNotFound} when `source` doesn't exist.
   * @throws {@link FileSystemError.FileNotFound} when parent of `destination` doesn't exist, e.g. no mkdirp-logic required.
   * @throws {@link FileSystemError.FileExists} when `destination` exists.
   * @throws {@link FileSystemError.NoPermissions} when permissions aren't sufficient.
   */
  move(
    source: monaco.Uri,
    destination: monaco.Uri,
    options: { copy: boolean }
  ): void | Promise<void>;

  /**
   * Uploads `file` to the directory `destination`.
   *
   * @param file The file object to upload.
   * @param destination The uri where the file should be uploaded.
   * @throws {@link FileSystemError.FileNotFound} when the `destination` parent doesn't exist.
   * @throws {@link FileSystemError.FileExists} when `destination` already exists.
   * @throws {@link FileSystemError.NoPermissions} when permissions aren't sufficient.
   */
  upload(file: File, destination: monaco.Uri): void | Promise<void>;

  search(
    uri: monaco.Uri,
    form: SearchForm
  ): Promise<SearchResult<monaco.Uri>[]>;
}

export abstract class FileSystemProvider implements IFileSystemProvider {
  abstract readonly scheme: string;
  abstract readonly capabilities: FileSystemProviderCapabilities;

  hasCapability(capability: FileSystemProviderCapabilities): boolean {
    return !!(this.capabilities & capability);
  }

  readDirectory(uri: monaco.Uri): IFile[] | Promise<IFile[]> {
    throw new Error('Operation not supported');
  }

  createDirectory(uri: monaco.Uri): void | Promise<void> {
    throw new Error('Operation not supported');
  }

  upload(file: File, destination: monaco.Uri): void | Promise<void> {
    throw new Error('Operation not supported');
  }

  read(uri: monaco.Uri): string | Promise<string> {
    throw new Error('Operation not supported');
  }

  write(
    uri: monaco.Uri,
    content: string,
    update: boolean
  ): void | Promise<void> {
    throw new Error('Operation not supported');
  }

  delete(uri: monaco.Uri): void | Promise<void> {
    throw new Error('Operation not supported');
  }

  rename(uri: monaco.Uri, name: string): void | Promise<void> {
    throw new Error('Operation not supported');
  }

  move(
    source: monaco.Uri,
    destination: monaco.Uri,
    options: { copy: boolean }
  ): void | Promise<void> {
    throw new Error('Operation not supported');
  }

  search(
    uri: monaco.Uri,
    form: SearchForm
  ): Promise<SearchResult<monaco.Uri>[]> {
    throw new Error('Operation not supported');
  }
}

/**
 * Gets a human readable name of the given `capability`
 * @param capability The capability to convert.
 */
export function fileSystemProviderCapabilityName(
  capability: FileSystemProviderCapabilities
) {
  return (
    {
      FileRead: 'FileRead',
      FileWrite: 'FileWrite',
      FileDelete: 'FileDelete',
      FileUpload: 'FileUpload',
      FileMove: 'FileMove',
      FileSearch: 'FileSearch',
    } as Record<FileSystemProviderCapabilities, string>
  )[capability];
}
