import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { URI } from 'vscode-uri';
import { IContribution } from '../contributions/index';
import { Paths } from '../utils//index';
import { IFile, IFolder, isResourceAncestor, isSameResource, resourceId, resourceParent } from './file';
import { FileSystemError } from './file-system-error';
import {
    FileChangeType,
    FileSystemProviderCapabilities,
    fileSystemProviderCapabilityName,
    IFileChange,
    IFileSystemProvider
} from './file-system-provider';
import { SearchForm, SearchResult } from './file-system-search';

declare type FilePredicate = (file: IFile) => boolean;

interface FileContent {
    initial: string;
    current: string;
    changed: boolean;
}

@Injectable()
export class FileService implements IContribution {
    readonly id = 'workbench.contrib.file-service';

    private readonly providers = new Map<string, IFileSystemProvider>();

    private readonly folders: IFolder[] = [];
    private readonly entries: Map<string, IFile> = new Map();
    private readonly children: Map<string, IFile[]> = new Map();

    private readonly tree = new BehaviorSubject<IFile[]>([]);
    private readonly contents = new BehaviorSubject(new Map<string, FileContent>());

    private readonly didChangeFile: Subject<IFileChange[]> = new Subject();
    private readonly willChangeFile: Subject<IFileChange[]> = new Subject();

    private readonly didRefresh: Subject<void> = new Subject();
    private readonly willRefresh: Subject<void> = new Subject();

    private readonly didSaveFile = new Subject<URI>();
    private readonly willSaveFile = new Subject<URI>();
    private readonly didCloseFile = new Subject<URI>();
    private readonly willCloseFile = new Subject<URI>();

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
    readonly onWillCloseFile = this.willCloseFile.asObservable();;

    /** Emitted after creating/updating/deleting a file. */
    readonly onDidChangeFile = this.didChangeFile.asObservable();
    /** Emitted before creating/updating/deleting a file. */
    readonly onWillChangeFile = this.willChangeFile.asObservable();

    deactivate(): void {
        this.entries.clear();
        this.children.clear();
        this.providers.clear();

        this.folders.splice(0, this.folders.length);

        this.tree.next([]);
        this.contents.next(new Map());
    }

    async refresh(): Promise<void> {
        await this.readEntries();
        this.removeMissingFileContents();
        this.rebuildIndex();
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
            throw new Error(`A provider for the scheme ${provider.scheme} is already registered.`);
        }
        this.providers.set(provider.scheme, provider);
    }

    registerFolders(...folders: IFolder[]): Promise<void> {
        this.folders.push(...folders);
        return this.refresh();
    }

    /**
     * Checks if the service can handle the given uri.
     * @param uri URI to test.
     *
     * @returns `true` if the uri can be handled `false` otherwise.
     */
    canHandle(uri: monaco.Uri | URI): boolean {
        return this.providers.has(uri.scheme);
    }

    /**
     * Checks if the {@link IFileSystemProvider} registered for the the given uri scheme provides the given `capability`.
     * @param uri URI to test.
     * @param capability The required capability.
     *
     * @returns `true` if the uri can be handled and the required capability can be provided.
     */
    hasCapability(uri: monaco.Uri | URI, capability: FileSystemProviderCapabilities) {
        const provider = this.providers.get(uri.scheme);
        if (!provider) {
            return false;
        }
        return provider.hasCapability(capability);
    }

    // CONTENT MANAGEMENT

    contentChange(uri: monaco.Uri | URI): Observable<FileContent | undefined> {
        return this.contents.pipe(
            map(value => value.get(resourceId(uri)))
        );
    }

    isDirty(uri?: monaco.Uri | URI): boolean {
        const map = this.contents.value;
        if (uri) {
            return !!map.get(resourceId(uri))?.changed;
        }

        for (const content of map.values()) {
            if (content.changed) {
                return true;
            }
        }

        return false;
    }

    update(uri: monaco.Uri | URI, content: string): void {
        const map = this.contents.value;

        const id = resourceId(uri);
        const fileContent = map.get(id);
        if (!fileContent) {
            throw FileSystemError.FileNotFound(uri);
        }

        map.set(id, {
            ...fileContent,
            current: content,
            changed: fileContent.initial !== content
        });

        this.contents.next(map);
    }

    async open(uri: monaco.Uri | URI): Promise<FileContent> {
        const id = resourceId(uri);
        const map = this.contents.value;

        const content = map.get(id);
        if (content) {
            return content;
        }

        const value = await this.readFile(uri);
        const newContent = { initial: value, current: value, changed: false };
        this.contents.next(map.set(id, newContent));

        return newContent;
    }

    /**
     * Saves the file of the given uri if it's not a readonly file.
     * @param uri URI to save.
     * @returns A promises that resolves once the operation done.
     * @throws {@link FileSystemError.FileNotFound} when `uri` doesn't exist.
     */
    async save(uri: monaco.Uri | URI): Promise<void> {
        const file = this.find(uri);
        if (!file) {
            throw FileSystemError.FileNotFound(uri);
        }

        if (file.readOnly) {
            return;
        }

        const id = resourceId(uri);
        const content = this.contents.value.get(id);
        if (!content) {
            throw FileSystemError.FileNotFound(uri);
        }

        if (content.changed) {
            this.willSaveFile.next(uri);

            await this.writeFile(uri, content.current);

            content.changed = false;

            this.contents.value.set(id, content);
            this.contents.next(this.contents.value);

            this.didSaveFile.next(uri);
        }
    }

    async close(uri: monaco.Uri | URI): Promise<void> {
        this.willCloseFile.next(uri);
        this.contents.value.delete(resourceId(uri));
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
            if (!entries.some(r2 => isResourceAncestor(r1, r2))) {
                nodes.push(r1);
            }
        });
        return nodes;
    }

    find(uri: URI): IFile | undefined {
        return this.entries.get(resourceId(uri));
    }

    findAll(predicate: FilePredicate): IFile[] {
        const entries = [];
        for (const pair of this.entries) {
            if (predicate(pair[1])) {
                entries.push(pair[1]);
            }
        }
        return entries;
    }

    findChildren(entry: IFile): IFile[] {
        return this.children.get(resourceId(entry)) || [];
    }

    findPredicate(predicate: FilePredicate): IFile | undefined {
        for (const pair of this.entries) {
            if (predicate(pair[1])) {
                return pair[1];
            }
        }
        return undefined;
    }

    async search(form: SearchForm): Promise<SearchResult<IFile>[]> {
        const results = await Promise.all(this.folders.map(async folder => {
            try {
                const file = this.find(folder.uri);
                if (!file)
                    return [];
                const provider = await this.withProvider(folder.uri, FileSystemProviderCapabilities.FileSearch);
                return await provider.searchIn(file, form);
            } catch {
                return [];
            }
        }));
        return results.reduce((acc, val) => acc.concat(val), []);
    }

    // UTILS

    isRoot(uri: monaco.Uri | URI): boolean {
        return this.folders.some(f => resourceId(uri) === resourceId(f.uri));
    }

    entryName(entry: IFile): string {
        const folder = this.folders.find(f => resourceId(entry) === resourceId(f.uri));
        return folder?.name || Paths.basename(entry.uri.path);
    }

    // OPERATIONS

    async readFile(
        uri: URI
    ): Promise<string> {
        const provider = await this.withProvider(uri, FileSystemProviderCapabilities.FileRead);
        return provider.read(uri);
    }

    async writeFile(
        uri: URI,
        content: string
    ): Promise<void> {
        const provider = await this.withProvider(uri, FileSystemProviderCapabilities.FileWrite);
        return provider.write(uri, content, true);
    }

    async createFile(
        parent: IFile,
        fileName: string
    ): Promise<void> {
        await this.doCreate(parent, fileName, false);
        await this.refresh();
    }

    async createDirectory(
        parent: IFile,
        dirName: string
    ): Promise<void> {
        await this.doCreate(parent, dirName, true);
        await this.refresh();
    }

    async upload(
        file: File,
        destination: IFile,
    ) {
        const provider = await this.withProvider(destination.uri, FileSystemProviderCapabilities.FileUpload);

        const newUri = destination.uri.with({
            path: Paths.normalize(Paths.join([destination.uri.path, file.name])),
        });

        this.willChangeFile.next([
            { type: FileChangeType.Created, uri: newUri },
        ]);

        await provider.upload(file, destination.uri);

        this.didChangeFile.next([
            { type: FileChangeType.Created, uri: newUri }
        ]);

        await this.refresh();
    }

    async rename(
        entry: IFile,
        newName: string
    ): Promise<void> {
        newName = newName.trim();
        if (this.entryName(entry) === newName) {
            return;
        }
        const provider = await this.withProvider(entry.uri, FileSystemProviderCapabilities.FileWrite);

        const newUri = entry.uri.with({
            path: Paths.normalize(Paths.join([
                Paths.dirname(entry.uri.path),
                newName
            ])),
        });

        this.willChangeFile.next([
            { type: FileChangeType.Deleted, uri: entry.uri }
        ]);
        this.willChangeFile.next([
            { type: FileChangeType.Created, uri: newUri }
        ]);

        await provider.rename(entry.uri, newName);

        this.didChangeFile.next([
            { type: FileChangeType.Deleted, uri: entry.uri }
        ]);
        this.didChangeFile.next([
            { type: FileChangeType.Created, uri: newUri }
        ]);

        await this.refresh();
    }

    async delete(
        entry: IFile
    ): Promise<void> {
        await this.doDelete(entry);
        await this.refresh();
    }

    async deleteAll(
        entries: IFile[]
    ) {
        await Promise.all(entries.map(this.doDelete.bind(this)));
        await this.refresh();
    }

    async move(
        source: IFile,
        destination: IFile
    ): Promise<void> {
        await this.doMove(source, destination);
        await this.refresh();
    }

    async copy(
        source: IFile[],
        destination: IFile
    ) {
        const entries = this.normalize(source);
        await Promise.all(entries.map(entry => this.doMove(entry, destination, true)));
        await this.refresh();
    }


    private async doMove(
        source: IFile,
        destination: IFile,
        copy?: boolean
    ): Promise<void> {
        if (this.isRoot(source.uri)) {
            throw FileSystemError.NoPermissions('Cannot move root file.');
        }

        const sourceProvider = await this.withProvider(source.uri, FileSystemProviderCapabilities.FileMove);
        const targetProvider = await this.withProvider(destination.uri, FileSystemProviderCapabilities.FileMove);
        if (sourceProvider.scheme !== targetProvider.scheme) {
            throw FileSystemError.NoPermissions(`The scheme of the destination should be the same as the source file to move.`);
        }

        if (isSameResource(source, destination)) {
            return;
        }

        if (isResourceAncestor(destination, source)) {
            return;
        }

        // TODO emit change events
        await sourceProvider.move(source.uri, destination.uri, { copy: !!copy });
    }

    private async doCreate(
        parent: IFile,
        name: string,
        isFolder: boolean
    ): Promise<void> {
        const provider = await this.withProvider(parent.uri, FileSystemProviderCapabilities.FileWrite);
        if (parent.readOnly) {
            throw FileSystemError.NoPermissions(parent.uri);
        }

        const uri = parent.uri.with({
            path: Paths.normalize(Paths.join([parent.uri.path, name])),
        });

        this.willChangeFile.next([
            { type: FileChangeType.Created, uri }
        ]);

        if (isFolder) {
            await provider.createDirectory(uri);
        } else {
            await provider.write(uri, '', false);
        }

        this.didChangeFile.next([
            { type: FileChangeType.Created, uri }
        ]);
    }

    private async doDelete(
        entry: IFile
    ) {
        const provider = await this.withProvider(entry.uri, FileSystemProviderCapabilities.FileDelete);
        this.willChangeFile.next([
            { type: FileChangeType.Deleted, uri: entry.uri }
        ]);
        await provider.delete(entry.uri);
        this.didChangeFile.next([
            { type: FileChangeType.Deleted, uri: entry.uri }
        ]);
    }

    private async withProvider(
        uri: URI,
        ...capabilities: FileSystemProviderCapabilities[]
    ): Promise<IFileSystemProvider> {
        if (!Paths.isAbsolutePath(uri.path)) {
            throw new Error(`Unable to resolve filesystem provider with relative file path "${uri.toString()}"`);
        }

        const provider = this.providers.get(uri.scheme);
        if (!provider) {
            throw new Error(`No file system provider found for ${uri.toString()}`);
        }

        for (const capability of capabilities) {
            if (!provider.hasCapability(capability)) {
                const name = fileSystemProviderCapabilityName(capability);
                throw new Error(`Filesystem provider for scheme '${uri.scheme}' does not have ${name} capability.`);
            }
        }

        return provider;
    }

    private async readEntries() {
        this.entries.clear();
        this.children.clear();

        for (const folder of this.folders) {
            const provider = await this.withProvider(folder.uri);
            const files = await provider.readDirectory(folder.uri);
            files.forEach((file) => {
                const id = resourceId(file);
                this.entries.set(id, file);

                const parent = resourceId(resourceParent(file));
                const children = this.children.get(parent) || [];
                children.push(file);
                this.sortFiles(children);

                this.children.set(parent, children);
                if (file.isFolder) { // allow loopkup for folders with or without ending slash
                    this.children.set(parent + '/', children);
                }
            });
        }
    }

    private rebuildIndex(): void {
        const tree: IFile[] = [];
        this.folders.forEach(folder => {
            tree.push(this.find(folder.uri)!);
        });
        this.tree.next(this.sortFiles(tree));
    }

    private removeMissingFileContents() {
        const contents = this.contents.value;
        contents.forEach((_, k) => {
            if (!this.entries.has(k)) {
                contents.delete(k);
            }
        });
        this.contents.next(contents);
    }

    private sortFiles(files: IFile[]): IFile[] {
        return files.sort((a, b) => {
            const isBothDir = a.isFolder && b.isFolder;
            const isBothFile = !a.isFolder && !b.isFolder;
            if (isBothDir || isBothFile) {
                return a.uri.path.localeCompare(b.uri.path);
            }
            return a.isFolder ? -1 : 1;
        });
    }
}
