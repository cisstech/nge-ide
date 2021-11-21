import { URI } from "vscode-uri";
import { Paths } from "../utils";
import { IFile } from "./file";
import { FileSystemError } from "./file-system-error";
import { FileSystemProvider, FileSystemProviderCapabilities } from "./file-system-provider";

class MemFile implements IFile {
    uri: URI;
    version: any;
    content?: string;
    readOnly: boolean;
    isFolder: boolean;

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

        ['/hello', new MemFile('folder', '/hello')],
        ['/hello/hello.component.ts', new MemFile('file', '/hello/hello.component.ts', '')],
        ['/hello/hello.component.html', new MemFile('file', '/hello/hello.component.html', '')],
        ['/hello/hello.component.scss', new MemFile('file', '/hello/hello.component.scss', '')],


        ['/world', new MemFile('folder', '/world')],
        ['/world/world.component.ts', new MemFile('file', '/world/world.component.ts', '')],
        ['/world/world.component.html', new MemFile('file', '/world/world.component.html', '')],
        ['/world/world.component.scss', new MemFile('file', '/world/world.component.scss', '')],
    ]);

    readonly scheme = 'inmemory';
    readonly capabilities = FileSystemProviderCapabilities.FileRead |
        FileSystemProviderCapabilities.FileWrite |
        FileSystemProviderCapabilities.FileMove |
        FileSystemProviderCapabilities.FileDelete;


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
        }

        if (entry.isFolder) {
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
            if (oldPath.startsWith(oldPrefix)) {
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
