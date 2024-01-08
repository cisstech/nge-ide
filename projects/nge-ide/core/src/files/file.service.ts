import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IContribution } from '../contributions/index';
import { Paths } from '../utils//index';
import { IFile } from './file';
import { FileSystemError } from './file-system-error';
import {
  FileChangeType,
  FileSystemProviderCapabilities,
  IFileChange,
  IFileSystemProvider,
  fileSystemProviderCapabilityName,
} from './file-system-provider';
import { SearchForm, SearchResult } from './file-system-search';

declare type FilePredicate = (file: IFile) => boolean;

interface IFolder {
  uri: monaco.Uri;
  name: string;
}

interface IContent {
  initial: string | undefined;
  current: string;
  changed: boolean;
}

const uriID = (uri: monaco.Uri) => uri.with({ query: '' }).toString(true);
const cleanUri = (uri: monaco.Uri) => uri.with({ query: '' });

@Injectable()
export class FileService implements IContribution {
  readonly id = 'workbench.contrib.file-service';

  private readonly providers = new Map<string, IFileSystemProvider>();

  private folderSorter?: (a: IFolder, b: IFolder) => number
  private nameProvider?: (uri: monaco.Uri) => string

  private readonly folders: IFolder[] = [];
  private readonly entries: Map<string, IFile> = new Map();
  private readonly unRegisteredEntries: Map<string, IFile> = new Map();
  private readonly parents: Map<string, IFile> = new Map();
  private readonly children: Map<string, IFile[]> = new Map();

  private readonly tree = new BehaviorSubject<IFile[]>([]);
  private readonly contents = new BehaviorSubject(new Map<string, IContent>());

  private readonly didChangeFile: Subject<IFileChange[]> = new Subject();
  private readonly willChangeFile: Subject<IFileChange[]> = new Subject();

  private readonly didRefresh: Subject<void> = new Subject();
  private readonly willRefresh: Subject<void> = new Subject();

  private readonly didSaveFile = new Subject<monaco.Uri>();
  private readonly willSaveFile = new Subject<monaco.Uri>();
  private readonly didCloseFile = new Subject<monaco.Uri>();
  private readonly willCloseFile = new Subject<monaco.Uri>();

  readonly treeChange: Observable<IFile[]> = this.tree.asObservable();

  /** Emitted after refreshing the files.. */
  readonly onDidRefresh = this.didRefresh.asObservable();
  /** Emitted before refreshing the files. */
  readonly onWillRefresh = this.willRefresh.asObservable();

  /** Emitted after saving a file. */
  readonly onDidSaveFile = this.didSaveFile.asObservable();
  /** Emitted before saving a file. */
  readonly onWillSaveFile = this.willSaveFile.asObservable();

  /** Emitted after closing a file. */
  readonly onDidCloseFile = this.didCloseFile.asObservable();
  /** Emitted before closing a file. */
  readonly onWillCloseFile = this.willCloseFile.asObservable();

  /** Emitted after creating/updating/deleting a file. */
  readonly onDidChangeFile = this.didChangeFile.asObservable();
  /** Emitted before creating/updating/deleting a file. */
  readonly onWillChangeFile = this.willChangeFile.asObservable();

  deactivate(): void {
    this.entries.clear();
    this.parents.clear();
    this.children.clear();
    this.providers.clear();
    this.unRegisteredEntries.clear();

    this.tree.next([]);
    this.contents.next(new Map());

    this.folders.splice(0, this.folders.length);
  }


  getProvider<T extends IFileSystemProvider = IFileSystemProvider>(scheme: string): T | undefined {
    return this.providers.get(scheme) as T | undefined;
  }

  listProviders(): ReadonlyArray<IFileSystemProvider> {
    return Array.from(this.providers.values());
  }

  /**
   * Loads/Reloads the files inside all the folders registered using the {@link registerFolders} method.
   */
  async refresh(): Promise<void> {
    this.entries.clear();
    this.parents.clear();
    this.children.clear();
    this.unRegisteredEntries.clear();

    await Promise.all(
      this.folders.map(async (folder) => {
        await this.loadFolder(folder);
      })
    )

    this.rebuildIndex();
  }

  /**
   * Emits the current tree without reloading the files.
   */
  emitTreeChange() {
    this.tree.next(this.tree.value.slice());
  }

  // PROVIDERS

  hasProvider(scheme: string) {
    return this.providers.has(scheme);
  }

  /**
   * Registers a new {@link FileSystemProvider} for the certain scheme.
   * @param provider The file system provider that should be registered.
   */
  registerProvider(provider: IFileSystemProvider): void {
    if (this.providers.has(provider.scheme)) {
      throw new Error(
        `A provider for the scheme ${provider.scheme} is already registered.`
      );
    }
    this.providers.set(provider.scheme, provider);
  }

  /**
   * Checks if the service can handle the given uri.
   * @param uri monaco.Uri to test.
   *
   * @returns `true` if the uri can be handled `false` otherwise.
   */
  canHandle(uri: monaco.Uri): boolean {
    return this.providers.has(uri.scheme);
  }

  /**
   * Checks if the {@link IFileSystemProvider} registered for the the given uri scheme provides the given `capability`.
   * @param uri monaco.Uri to test.
   * @param capability The required capability.
   *
   * @returns `true` if the uri can be handled and the required capability can be provided.
   */
  hasCapability(uri: monaco.Uri, capability: FileSystemProviderCapabilities) {
    const provider = this.providers.get(uri.scheme);
    if (!provider) {
      return false;
    }
    return provider.hasCapability(capability);
  }

  hasCapabilityForAnyProvider(capability: FileSystemProviderCapabilities) {
    return !!Array.from(this.providers.values()).find(e => e.hasCapability(capability));
  }

  // Folders

  /**
   * Registers the specified folders and loads their tree structure into the index.
   *
   * @param folders The folders to register.
   * @returns A promise that resolves when the registration is complete.
   */
  async registerFolders(...folders: IFolder[]): Promise<void> {
    this.folders.push(...folders);
    await Promise.all(folders.map((f) => this.loadFolder(f)));
    return this.rebuildIndex();
  }

  /**
   * Unregisters the specified folders from the file service.
   *
   * @remarks
   * - This will also remove all the files inside the unregistered folders from the index.
   *
   * @param uris - The URIs of the folders to unregister.
   */
  unregisterFolders(...uris: monaco.Uri[]): void {
    this.folders.splice(
      0,
      this.folders.length,
      ...this.folders.filter(
        (f) => !uris.some((uri) => uriID(uri) === uriID(f.uri))
      )
    );

    this.removeFoldersFromIndex(uris);

    this.rebuildIndex();
  }

  /**
   * Replaces a root folder with a new folder.
   *
   * @remarks
   * - This will also remove all the files inside the unregistered folders from the index.
   *
   * @param oldUri The URI of the folder to be replaced.
   * @param newFolder The new folder object.
   * @returns A promise that resolves when the folder is replaced.
   * @throws Error if the folder to be replaced is not registered.
   */
  async replaceFolder(oldUri: monaco.Uri, newFolder: IFolder): Promise<void> {
    const index = this.folders.findIndex(
      (f) => uriID(f.uri) === uriID(oldUri)
    );
    if (index === -1) {
      throw new Error(`Folder ${oldUri.toString(true)} is not registered.`);
    }

    this.removeFoldersFromIndex([oldUri]);

    this.folders[index] = newFolder;

    await this.loadFolder(newFolder);

    this.rebuildIndex()
  }

  /**
   * Registers a function that will be used to sort the folders.
   * @param sorter The sorter function.
   */
  registerFolderSorter(sorter: (a: IFolder, b: IFolder) => number) {
    this.folderSorter = sorter;
  }

  /**
   * Registers a function that will be used to get the name of a file.
   * @param provider The name provider function.
   */
  registerNameProvider(provider: (uri: monaco.Uri) => string) {
    this.nameProvider = provider;
  }

  // CONTENT MANAGEMENT

  /**
   * Gets a value indicating whether the content of the file `uri` has changed.
   *
   * Note : Checks all files if the method is not called with the `uri` argument.
   *
   * @param uri An optional uri to test.
   */
  isDirty(uri?: monaco.Uri): boolean {
    const contents = this.contents.value;
    if (uri) {
      return !!contents.get(uriID(uri))?.changed;
    }
    return Array.from(contents.values()).some((content) => content.changed);
  }

  /**
   * Watches for changes in the content of the file identified by the given URI.
   *
   * @param uri - The URI of the file.
   * @returns An Observable that emits the content of the file, or undefined if the file does not exist or it's not opened.
   */
  contentChange(uri: monaco.Uri): Observable<IContent | undefined> {
    const id = uriID(uri)
    return this.contents.pipe(map((value) => value.get(id)));
  }

  /**
   * Updates the content of a file identified by the given URI.
   * @remarks
   * - This will not update the file by calling it's provider `write` method but it will only update the content editor cache.
   * - To persist the changes, you should call the {@link save} method.
   * @param uri - The URI of the file to update.
   * @param content - The new content of the file.
   */
  update(uri: monaco.Uri, content: string): void {
    uri = cleanUri(uri)

    const id = uriID(uri)
    const contents = this.contents.value;
    const match = contents.get(id) || {
      changed: true,
      initial: undefined,
      current: content,
    }

    contents.set(id, {
      ...match,
      current: content,
      changed: match.initial !== content,
    });

    this.contents.next(contents);
  }

  /**
   * Opens a file with the specified URI and returns its content.
   * If the content is already available, it is returned from the cache.
   * Otherwise, the file is read and added to the cache before returning its content.
   * @param uri The URI of the file to open.
   * @returns A promise that resolves to the content of the file.
   */
  async open(uri: monaco.Uri): Promise<IContent> {
    uri = cleanUri(uri)

    const id = uriID(uri)
    const contents = this.contents.value;
    const content = contents.get(id);
    if (content) {
      return content;
    }

    const value = await this.readFile(uri);
    const newContent = { initial: value, current: value, changed: false };
    this.contents.next(contents.set(id, newContent));

    return newContent;
  }

  /**
   * Saves the file of the given uri if it's not a readonly file.
   * @param uri monaco.Uri to save.
   * @returns A promises that resolves once the operation done.
   * @throws {@link FileSystemError.FileNotFound} when `uri` doesn't exist or it's has not been opened before with the {@link open} method.
   */
  async save(uri: monaco.Uri): Promise<void> {
    uri = cleanUri(uri)

    const id = uriID(uri)
    const file = await this.find(uri);
    if (!file) {
      throw FileSystemError.FileNotFound(uri);
    }

    if (file.readOnly) {
      return;
    }

    const content = this.contents.value.get(id) || await this.open(uri);
    if (!content) {
      throw FileSystemError.FileNotFound(uri);
    }

    if (content.changed) {
      this.willSaveFile.next(uri);

      await this.writeFile(uri, content.current);

      content.changed = false;
      content.initial = content.initial || content.current;

      this.contents.value.set(id, content);
      this.contents.next(this.contents.value);

      this.didSaveFile.next(uri);
    }
  }

  async close(uri: monaco.Uri): Promise<void> {
    uri = cleanUri(uri)
    this.willCloseFile.next(uri);
    this.contents.value.delete(uriID(uri));
    this.contents.next(this.contents.value);
    this.didCloseFile.next(uri);
  }

  // SEARCH

  /**
   * Removes redundant entries from the list.
   *
   * A redundant item is an item in the list whose parent is also present.
   *
   * Ex. If B is a child of A then B will be removed from the list.
   * @param entries The entries to normalize.
   */
  normalize(entries: IFile[]): IFile[] {
    const nodes: IFile[] = [];
    entries.forEach((r1) => {
      if (!entries.some((r2) => this.isAncestor(r1.uri, r2.uri))) {
        nodes.push(r1);
      }
    });
    return nodes;
  }

  /**
   * Finds a file by its uri from currently registered folders or or by searching in the registered providers.
   * @param uri The uri to find.
   * @returns A promise that resolves with the file if found `undefined` otherwise.
   */
  async find(uri: monaco.Uri): Promise<IFile | undefined> {
    const entry = this.entries.get(uriID(uri)) || this.unRegisteredEntries.get(uriID(uri));
    if (entry) return entry;

    const provider = await this.withProvider(uri, FileSystemProviderCapabilities.FileStat);
    const file = await provider.stat(uri);
    this.unRegisteredEntries.set(uriID(uri), file);
    return file;
  }

  /**
   * Filters out the current known files using the given predicate.
   * @remarks
   * - This will not includes files from folders that are not registered.
   *
   * @param predicate The predicate to filter the files.
   * @returns The filtered files.
   */
  findAll(predicate: FilePredicate): IFile[] {
    const entries = [];
    for (const pair of this.entries) {
      if (predicate(pair[1])) {
        entries.push(pair[1]);
      }
    }
    return entries;
  }

  /**
   * Finds the children of the given entry.
   *
   * @remarks
   * - This will always return an empty array if the entry is not inside a registered folder.
   * @param entry The entry to find its children.
   * @returns The children of the given entry.
   */
  findChildren(entry: IFile): IFile[] {
    return this.children.get(uriID(entry.uri)) || [];
  }

  /**
   * Searches for files in the registered folders that supports the {@link FileSystemProviderCapabilities.FileSearch} capability.
   * @param form The search form.
   * @returns A promise that resolves with the search results.
   */
  async search(form: SearchForm): Promise<SearchResult<monaco.Uri>[]> {
    const results = await Promise.all(
      this.folders.map(async (folder) => {
        const folderEntry = await this.find(folder.uri);
        if (!folderEntry) {
          return [];
        }
        if (
          !this.hasCapability(
            folder.uri,
            FileSystemProviderCapabilities.FileSearch
          )
        ) {
          return [];
        }
        const provider = await this.withProvider(
          folder.uri,
          FileSystemProviderCapabilities.FileSearch
        );
        return await provider.search(folderEntry.uri, form);
      })
    );

    return results.reduce((acc, val) => acc.concat(val), []);
  }

  // UTILS

  entryId(uri: monaco.Uri): string {
    return uriID(uri);
  }

  /**
   * Determines whether the given uri is a root folder currently registered.
   * @param uri The uri to test.
   * @returns `true` if the uri is a root folder `false` otherwise.
   */
  isRoot(uri: monaco.Uri): boolean {
    return this.folders.some(
      (f) => uriID(f.uri) === uriID(uri)
    );
  }

  /**
   * Determines whether the given uri is a parent of the given candidate.
   * @param uri The uri to test.
   * @param candidate The candidate to test.
   * @returns `true` if the uri is a parent of the candidate `false` otherwise.
   */
  isParent(uri: monaco.Uri, candidate: monaco.Uri): boolean {
    const a = uriID(uri);
    const b = uriID(candidate);
    const parent = this.parents.get(a);
    if (!parent) {
      return false;
    }
    return a === b;
  }

  /**
   * Determines whether the given uri is a child of the given candidate.
   * @param uri The uri to test.
   * @param candidate The candidate to test.
   * @returns `true` if the uri is a child of the candidate `false` otherwise.
   */
  isAncestor(uri: monaco.Uri, candidate: monaco.Uri): boolean {
    const a = uriID(uri);
    const b = uriID(candidate);
    if (a === b) {
      return false;
    }
    return a.startsWith(b);
  }


  /**
   * Returns the entry name for the given URI.
   * If the URI belongs to a folder, it returns the folder name.
   * If the URI is a file, it returns the file name.
   * If the URI is the root folder, it returns the authority.
   * @remarks
   * - If a name provider is registered with the {@link registerNameProvider} method, it will be used to get the entry name.
   * @param uri The URI for which to get the entry name.
   * @returns The entry name for the given URI.
   */
  entryName(uri: monaco.Uri): string {
    if (this.nameProvider) {
      return this.nameProvider(uri);
    }

    const folder = this.folders.find((f) => uriID(uri) === uriID(f.uri));
    if (folder?.name) {
      return folder.name;
    }
    const basename = Paths.basename(uri.path);
    if (!basename || basename === '/') {
        return uri.authority;
    }
    return basename;
  }

  // OPERATIONS

  async readFile(uri: monaco.Uri): Promise<string> {
    uri = cleanUri(uri)
    const provider = await this.withProvider(
      uri,
      FileSystemProviderCapabilities.FileRead
    );
    return provider.read(uri);
  }

  async writeFile(uri: monaco.Uri, content: string): Promise<void> {
    uri = cleanUri(uri)
    const provider = await this.withProvider(
      uri,
      FileSystemProviderCapabilities.FileWrite
    );
    return provider.write(uri, content, true);
  }

  async createFile(parent: IFile, fileName: string): Promise<void> {
    await this.doCreate(parent, fileName, false);
    await this.refresh();
  }

  async createDirectory(parent: IFile, dirName: string): Promise<void> {
    await this.doCreate(parent, dirName, true);
    await this.refresh();
  }

  async upload(file: File, destination: IFile) {
    const provider = await this.withProvider(
      destination.uri,
      FileSystemProviderCapabilities.FileUpload
    );

    const newUri = destination.uri.with({
      path: Paths.normalize(Paths.join([destination.uri.path, file.name])),
    });

    this.willChangeFile.next([{ type: FileChangeType.Created, uri: newUri }]);

    await provider.upload(file, destination.uri);

    this.didChangeFile.next([{ type: FileChangeType.Created, uri: newUri }]);

    await this.refresh();
  }

  async rename(entry: IFile, newName: string): Promise<void> {
    newName = newName.trim();
    if (this.entryName(entry.uri) === newName) {
      return;
    }

    const provider = await this.withProvider(
      entry.uri,
      FileSystemProviderCapabilities.FileWrite
    );

    const newUri = entry.uri.with({
      path: Paths.normalize(
        Paths.join([Paths.dirname(entry.uri.path), newName])
      ),
    });

    this.willChangeFile.next([
      { type: FileChangeType.Deleted, uri: entry.uri },
    ]);
    this.willChangeFile.next([{ type: FileChangeType.Created, uri: newUri }]);

    await provider.rename(entry.uri, newName);

    this.didChangeFile.next([{ type: FileChangeType.Deleted, uri: entry.uri }]);
    this.didChangeFile.next([{ type: FileChangeType.Created, uri: newUri }]);

    await this.refresh();
  }

  async delete(entry: IFile): Promise<void> {
    await this.doDelete(entry);
    await this.refresh();
  }

  async deleteAll(entries: IFile[]) {
    await Promise.all(entries.map(this.doDelete.bind(this)));
    await this.refresh();
  }

  async move(source: IFile, destination: IFile): Promise<void> {
    await this.doMove(source, destination);
    await this.refresh();
  }

  async copy(source: IFile[], destination: IFile) {
    const entries = this.normalize(source);
    await Promise.all(
      entries.map((entry) => this.doMove(entry, destination, true))
    );
    await this.refresh();
  }

  private async doMove(
    source: IFile,
    destination: IFile,
    copy?: boolean
  ): Promise<void> {
    if (this.isRoot(source.uri)) {
      throw FileSystemError.NoPermissions('Cannot move root folder.');
    }

    const sourceProvider = await this.withProvider(
      source.uri,
      FileSystemProviderCapabilities.FileMove
    );
    const targetProvider = await this.withProvider(
      destination.uri,
      FileSystemProviderCapabilities.FileMove
    );
    if (sourceProvider.scheme !== targetProvider.scheme) {
      throw FileSystemError.NoPermissions(
        `The scheme of the destination should be the same as the source file to move.`
      );
    }

    if (source.uri.with({ query: '' }).toString(true) === destination.uri.with({ query: '' }).toString(true)) {
      return;
    }

    if (this.isAncestor(destination.uri, source.uri)) {
      return;
    }

    await sourceProvider.move(source.uri, destination.uri, { copy: !!copy });
  }

  private async doCreate(
    parent: IFile,
    name: string,
    asFolder: boolean
  ): Promise<void> {
    const provider = await this.withProvider(
      parent.uri,
      FileSystemProviderCapabilities.FileWrite
    );
    if (parent.readOnly) {
      throw FileSystemError.NoPermissions(parent.uri);
    }

    const uri = parent.uri.with({
      path: Paths.normalize(Paths.join([parent.uri.path, name])),
    });

    this.willChangeFile.next([{ type: FileChangeType.Created, uri }]);

    if (asFolder) {
      await provider.createDirectory(uri);
    } else {
      await provider.write(uri, '', false);
    }

    this.didChangeFile.next([{ type: FileChangeType.Created, uri }]);
  }

  private async doDelete(entry: IFile) {
    const provider = await this.withProvider(
      entry.uri,
      FileSystemProviderCapabilities.FileDelete
    );
    this.willChangeFile.next([
      { type: FileChangeType.Deleted, uri: entry.uri },
    ]);
    await provider.delete(entry.uri);
    this.didChangeFile.next([{ type: FileChangeType.Deleted, uri: entry.uri }]);
  }

  private async withProvider(
    uri: monaco.Uri,
    ...capabilities: FileSystemProviderCapabilities[]
  ): Promise<IFileSystemProvider> {
    if (!Paths.isAbsolutePath(uri.path)) {
      throw new Error(
        `Unable to resolve filesystem provider with relative file path "${uri.toString(
          true
        )}"`
      );
    }

    const provider = this.providers.get(uri.scheme);
    if (!provider) {
      throw new Error(
        `No file system provider found for ${uri.with({ query: '' }).toString(true)}`
      );
    }

    for (const capability of capabilities) {
      if (!provider.hasCapability(capability)) {
        const name = fileSystemProviderCapabilityName(capability);
        throw new Error(
          `Filesystem provider for scheme '${uri.scheme}' does not have ${name} capability.`
        );
      }
    }

    return provider;
  }

  private rebuildIndex(): void {
    const tree: IFile[] = [];
    this.folders.sort(this.folderSorter).forEach((folder) => {
      const entry = this.entries.get(uriID(folder.uri))
      if (!entry) {
        return;
      }
      tree.push(entry);
    });

    this.children.forEach((v, _) => this.sortFiles(v));
    this.tree.next(tree);
  }

  private async loadFolder(folder: IFolder) {
    const provider = await this.withProvider(folder.uri);
    const files = await provider.readDirectory(folder.uri);
    files.forEach((file) => {
      const id = uriID(file.uri);
      this.entries.set(id, file);

      const prefix = id.substring(0, id.length - file.uri.fsPath.length);
      const parent = prefix + Paths.dirname(file.uri.fsPath);
      if (parent !== id) {
        const children = this.children.get(parent) || [];
        children.push(file);
        this.children.set(parent, children);
        this.parents.set(id, this.entries.get(parent)!);
      }
    });
  }


  private sortFiles(files: IFile[]): IFile[] {
    return files.sort((a, b) => {
      const isBothDir = a.isFolder && b.isFolder;
      const isBothFile = !a.isFolder && !b.isFolder;
      if (isBothDir || isBothFile) {
        return a.uri.path.localeCompare(b.uri.path, 'en', { numeric: true });
      }
      return a.isFolder ? -1 : 1;
    });
  }

  private removeFoldersFromIndex(uris: monaco.Uri[]) {
    const parentKeys = Array.from(this.parents.keys());
    const childrenKeys = Array.from(this.children.keys());
    uris.forEach((uri) => {
      parentKeys.forEach((key) => {
        if (this.isAncestor(monaco.Uri.parse(key), uri)) {
          this.parents.delete(key);
          this.entries.delete(key);
        }
      });

      childrenKeys.forEach((key) => {
        if (this.isAncestor(monaco.Uri.parse(key), uri)) {
          this.children.delete(key);
          this.entries.delete(key);
        }
      });

      this.entries.delete(uriID(uri));
      this.children.delete(uriID(uri));
      this.parents.delete(uriID(uri));
    });
  }
}
