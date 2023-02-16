import { SearchMatch } from '.';
import { Paths } from '../utils';
import { IFile } from './file';
import { FileSystemError } from './file-system-error';
import {
  FileSystemProvider,
  FileSystemProviderCapabilities,
} from './file-system-provider';
import { SearchForm, SearchResult } from './file-system-search';

const HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
`;

const MD = `
# H1
## H2
### H3

:::+ note Lorem
Lorem ipsum dolor, sit amet consectetur adipisicing elit.
Ex, provident! Dolor saepe in eveniet, amet cum velit, nihil unde explicabo beatae obcaecati
laudantium quas voluptates delectus esse, mollitia quis similique!
`;

const SCSS = `
h1 {
    color: red;
}
`;

const TS = `
console.log('Hello world');
`;

const SVG = `
<svg height="100" width="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
  Sorry, your browser does not support inline SVG.
</svg>
`;

const isChildOf = (child: string, parent: string) => {
  if (child === parent) return false;
  const childs = child.split('/').filter((e) => e.length);
  const parents = parent.split('/').filter((e) => e.length);
  return parents.every((t, i) => childs[i] === t);
};

const SCHEME = 'inmemory';
class MemFile implements IFile {
  uri: monaco.Uri;
  url?: string;
  content?: string;
  readOnly: boolean;
  isFolder: boolean;

  constructor(type: 'folder' | 'file', path: string, content?: string) {
    this.uri = monaco.Uri.parse(`${SCHEME}://${path}`);
    this.readOnly = false;
    this.isFolder = type === 'folder';
    this.content = content;
  }

  withPath(path: string): MemFile {
    return new MemFile(this.isFolder ? 'folder' : 'file', path, this.content);
  }
}

export class MemFileProvider extends FileSystemProvider {
  private readonly entries = new Map<string, MemFile>([
    ['/', new MemFile('folder', '/')],
  ]);

  readonly scheme = SCHEME;
  readonly capabilities =
    FileSystemProviderCapabilities.FileRead |
    FileSystemProviderCapabilities.FileWrite |
    FileSystemProviderCapabilities.FileMove |
    FileSystemProviderCapabilities.FileDelete |
    FileSystemProviderCapabilities.FileSearch |
    FileSystemProviderCapabilities.FileUpload;

  readonly root = monaco.Uri.parse(`${this.scheme}:///`);

  constructor(size = 10) {
    super();
    for (let i = 1; i <= size; i++) {
      this.entries.set(`/${i}`, new MemFile('folder', `/${i}`));
      this.entries.set(
        `/${i}/file.ts`,
        new MemFile('file', `/${i}/file.ts`, TS)
      );
      this.entries.set(
        `/${i}/file.scss`,
        new MemFile('file', `/${i}/file.scss`, SCSS)
      );
      this.entries.set(
        `/${i}/file.html`,
        new MemFile('file', `/${i}/file.html`, HTML)
      );
      this.entries.set(
        `/${i}/file.md`,
        new MemFile('file', `/${i}/file.md`, MD)
      );
      this.entries.set(
        `/${i}/file.svg`,
        new MemFile('file', `/${i}/file.svg`, SVG)
      );
    }
  }

  readDirectory(uri: monaco.Uri): Promise<IFile[]> {
    const entry = this._lookupAsDirectory(uri, false);
    const result: IFile[] = [entry];
    for (const f of this.entries.values()) {
      if (
        f.uri.path !== entry.uri.path &&
        isChildOf(f.uri.path, entry.uri.path)
      ) {
        result.push(f);
      }
    }
    return Promise.resolve(result);
  }

  read(uri: monaco.Uri): Promise<string> {
    const file = this._lookupAsFile(uri);
    if (file == null) {
      throw FileSystemError.FileNotFound();
    }
    return Promise.resolve(file.content || '');
  }

  write(uri: monaco.Uri, content: string, update?: boolean) {
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
  }

  createDirectory(uri: monaco.Uri) {
    this._lookupParentDirectory(uri);

    const entry = new MemFile('folder', uri.path);
    this.entries.set(uri.path, entry);
  }

  delete(uri: monaco.Uri) {
    this._lookup(uri, false);
    for (const k of this.entries.keys()) {
      if (k.startsWith(uri.path)) {
        this.entries.delete(k);
      }
    }
  }

  rename(uri: monaco.Uri, name: string) {
    this._lookup(uri, false);

    const oldPrefix = uri.path;
    const newPrefix = Paths.join([Paths.dirname(uri.path), name]);
    const entriesKeys = Array.from(this.entries.keys());

    for (const oldPath of entriesKeys) {
      if (oldPath.startsWith(oldPrefix)) {
        const newPath = newPrefix + oldPath.substring(oldPrefix.length);
        this.entries.set(newPath, this.entries.get(oldPath)!.withPath(newPath));
        this.entries.delete(oldPath);
      }
    }
  }

  move(
    source: monaco.Uri,
    destination: monaco.Uri,
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
          oldPath.substring(oldPrefixDir.length),
        ]);
        if (this.entries.has(newPath)) {
          throw FileSystemError.FileExists(newPath);
        }

        this.entries.set(newPath, this.entries.get(oldPath)!.withPath(newPath));

        if (!options.copy) {
          this.entries.delete(oldPath);
        }
      }
    }
  }

  upload(file: File, destination: monaco.Uri): Promise<void> {
    this._lookupAsDirectory(destination, false);

    destination = destination.with({
      path: Paths.normalize(Paths.join([destination.path, file.name])),
    });

    let entry = this._lookup(destination, true);
    if (entry) {
      throw FileSystemError.FileExists(destination);
    }

    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        entry = new MemFile('file', destination.path, content);
        entry.url = URL.createObjectURL(file);
        this.entries.set(destination.path, entry);
        resolve();
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  search(
    uri: monaco.Uri,
    form: SearchForm
  ): Promise<SearchResult<monaco.Uri>[]> {
    this._lookupAsDirectory(uri, false);
    const options: string[] = ['g'];
    if (!form.matchCase) {
      options.push('i');
    }

    let query = form.useRegex
      ? form.query
      : form.query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (form.matchWord) {
      query = `\\b${query}\\b`;
    }

    const pattern = new RegExp(query, options.join(''));
    const results: SearchResult<monaco.Uri>[] = [];

    for (const entry of this.entries.values()) {
      if (entry.uri.path !== uri.path && entry.uri.path.startsWith(uri.path)) {
        if (entry.content) {
          const matches: SearchMatch[] = [];
          const lines = entry.content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (pattern.exec(line)) {
              matches.push({
                match: line,
                lineno: i + 1,
              });
            }
          }

          if (matches.length > 0) {
            results.push({
              entry: entry.uri,
              matches,
            });
          }
        }
      }
    }

    return Promise.resolve(results);
  }

  private _lookup(uri: monaco.Uri, silent: boolean): MemFile | undefined {
    const entry = this.entries.get(uri.path);
    if (!entry && !silent) {
      throw FileSystemError.FileNotFound(uri);
    }
    return entry;
  }

  private _lookupAsDirectory(uri: monaco.Uri, silent: boolean): MemFile {
    const entry = this._lookup(uri, silent);
    if (entry?.isFolder) {
      return entry;
    }
    throw FileSystemError.FileNotADirectory(uri);
  }

  private _lookupAsFile(uri: monaco.Uri): MemFile {
    const entry = this._lookup(uri, false);
    if (entry && !entry.isFolder) {
      return entry;
    }

    throw FileSystemError.FileIsADirectory(uri);
  }

  private _lookupParentDirectory(uri: monaco.Uri): MemFile {
    const dirname = uri.with({ path: Paths.dirname(uri.path) });
    return this._lookupAsDirectory(dirname, false);
  }
}
