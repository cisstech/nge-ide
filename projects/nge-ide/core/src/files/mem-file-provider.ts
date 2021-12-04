import { URI } from "vscode-uri";
import { Paths } from "../utils";
import { IFile } from "./file";
import { FileSystemError } from "./file-system-error";
import { FileSystemProvider, FileSystemProviderCapabilities } from "./file-system-provider";
import { SearchForm, SearchResult } from "./file-system-search";

class MemFile implements IFile {
    uri: URI;
    version: any;
    content?: string;
    readOnly: boolean;
    isFolder: boolean;
    downloadUrl?: string;

    constructor(
        type: 'folder' | 'file',
        path: string,
        content?: string
    ) {
        path = Paths.normalize(path);
        this.uri = URI.parse(`inmemory://${path}`);
        this.version = 0;
        this.readOnly = false;
        this.isFolder = type === 'folder';
        this.content = content;
    }

    withPath(path: string): MemFile {
        return new MemFile(
            this.isFolder ? 'folder' : 'file',
            path,
            this.content
        );
    }
}

export class MemFileProvider extends FileSystemProvider {
    private readonly entries = new Map<string, MemFile>([
        ['/', new MemFile('folder', '/')],
    ]);

    readonly scheme = 'inmemory';
    readonly capabilities = FileSystemProviderCapabilities.FileRead |
        FileSystemProviderCapabilities.FileWrite |
        FileSystemProviderCapabilities.FileMove |
        FileSystemProviderCapabilities.FileDelete |
        FileSystemProviderCapabilities.FileSearch |
        FileSystemProviderCapabilities.FileUpload;

    constructor() {
        super();
        for (let i = 1; i <= 9; i++) {
            this.entries.set(`/folder-${i}`, new MemFile('folder', `/folder-${i}`));
            this.entries.set(`/folder-${i}/file.ts`, new MemFile('file', `/folder-${i}/file.ts`));
            this.entries.set(`/folder-${i}/file.scss`, new MemFile('file', `/folder-${i}/file.scss`));
            this.entries.set(`/folder-${i}/file.html`, new MemFile('file', `/folder-${i}/file.html`));
            this.entries.set(`/folder-${i}/file.md`, new MemFile('file', `/folder-${i}/file.md`));
            this.entries.set(`/folder-${i}/file.svg`, new MemFile('file', `/folder-${i}/file.svg`));
        }
    }

    readDirectory(uri: URI): Promise<IFile[]> {
        const entry = this._lookupAsDirectory(uri, false);
        const result: IFile[] = [entry];
        for (const f of this.entries.values()) {
            if (f.uri.path !== entry.uri.path && f.uri.path.startsWith(entry.uri.path)) {
                result.push(f);
            }
        }
        return Promise.resolve(result);
    }

    read(uri: URI): Promise<string> {
        const file = this._lookupAsFile(uri);
        if (file == null) {
            throw FileSystemError.FileNotFound();
        }
        return Promise.resolve(file.content || '');
    }

    write(uri: URI, content: string, update?: boolean) {
        this._lookupParentDirectory(uri);

        let entry = this._lookup(uri, true);
        if (!entry && update) {
            throw FileSystemError.FileNotFound(uri);
        }

        if (entry && !update) {
            throw FileSystemError.FileExists(uri);
        }

        if (!entry) {
            entry = new MemFile('file', uri.path, content);
            this.entries.set(uri.path, entry);
        } else if (entry.isFolder) {
            throw FileSystemError.FileIsADirectory(uri);
        }

        entry.content = content;
        entry.version++;
    }

    createDirectory(uri: URI) {
        this._lookupParentDirectory(uri);

        const entry = new MemFile('folder', uri.path);
        this.entries.set(uri.path, entry);
    }

    delete(uri: URI) {
        this._lookup(uri, false);
        for (const k of this.entries.keys()) {
            if (k.startsWith(uri.path)) {
                this.entries.delete(k);
            }
        }
    }

    rename(uri: URI, name: string) {
        this._lookup(uri, false);

        const oldPrefix = uri.path;
        const newPrefix = Paths.join([Paths.dirname(uri.path), name]);
        const entriesKeys = Array.from(this.entries.keys());

        for (const oldPath of entriesKeys) {
            if (oldPath.startsWith(oldPrefix)) {
                const newPath = newPrefix + oldPath.substring(oldPrefix.length);

                this.entries.set(
                    newPath,
                    this.entries.get(oldPath)!.withPath(newPath)
                );

                this.entries.delete(oldPath);
            }
        }
    }

    move(
        source: URI,
        destination: URI,
        options: { copy: boolean }
    ) {
        this._lookup(source, false);
        this._lookup(destination, false);

        const oldPrefix = source.path;
        const oldPrefixDir = Paths.dirname(oldPrefix);
        const entriesKeys = Array.from(this.entries.keys());
        for (const oldPath of entriesKeys) {
            if (oldPath.startsWith(oldPrefix + '/') || oldPath === oldPrefix) {
                const newPath = Paths.join([
                    destination.path,
                    oldPath.substring(oldPrefixDir.length)
                ]);

                if (this.entries.has(newPath)) {
                    throw FileSystemError.FileExists(newPath);
                }

                this.entries.set(
                    newPath,
                    this.entries.get(oldPath)!.withPath(newPath)
                );

                if (!options.copy) {
                    this.entries.delete(oldPath);
                }
            }
        }
    }

    upload(
        file: File,
        destination: URI,
    ): Promise<void> {
        this._lookupParentDirectory(destination);

        let entry = this._lookup(destination, true);
        if (entry) {
            throw FileSystemError.FileExists(destination);
        }

        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                entry = new MemFile('file', destination.path, content);
                entry.downloadUrl = URL.createObjectURL(file);
                this.entries.set(destination.path, entry);
                resolve();
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }


    searchIn(
        entry: IFile,
        search: SearchForm
    ): Promise<SearchResult<IFile>[]> {
        this._lookupAsDirectory(entry.uri, false);
        const options: string[] = ['g'];
        if (!search.matchCase) {
            options.push('i');
        }

        let query = search.useRegex
            ? search.query
            : search.query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        if (search.matchWord) {
            query = `\\b${query}\\b`;
        }

        const pattern = new RegExp(query, options.join(''));
        const results: SearchResult<IFile>[] = [];
        for (const f of this.entries.values()) {
            if (f.uri.path !== entry.uri.path && f.uri.path.startsWith(entry.uri.path)) {
                if (f.content) {
                    const r: SearchResult<IFile> = { entry: f, matches: [] };
                    const lines = f.content.split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        const matches = pattern.exec(line);
                        if (matches) {
                            r.matches.push({
                                match: line,
                                lineno: i + 1,
                            });
                        }
                    }

                    if (r.matches.length > 0) {
                        results.push(r);
                    }
                }
            }
        }

        return Promise.resolve(results);

    }



    private _lookup(uri: URI, silent: boolean): MemFile | undefined {
        const entry = this.entries.get(uri.path);
        if (!entry && !silent) {
            throw FileSystemError.FileNotFound(uri);
        }
        return entry;
    }

    private _lookupAsDirectory(uri: URI, silent: boolean): MemFile {
        const entry = this._lookup(uri, silent);
        if (entry?.isFolder) {
            return entry;
        }
        throw FileSystemError.FileNotADirectory(uri);
    }

    private _lookupAsFile(uri: URI): MemFile {
        const entry = this._lookup(uri, false);
        if (entry && !entry.isFolder) {
            return entry;
        }

        throw FileSystemError.FileIsADirectory(uri);
    }

    private _lookupParentDirectory(uri: URI): MemFile {
        const dirname = uri.with({ path: Paths.dirname(uri.path) });
        return this._lookupAsDirectory(dirname, false);
    }
}
