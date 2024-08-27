import { SearchMatch } from '.'
import { Paths } from '../utils'
import { IFile } from './file'
import { FileSystemError } from './file-system-error'
import { FileSystemProvider, FileSystemProviderCapabilities } from './file-system-provider'
import { SearchForm, SearchResult } from './file-system-search'

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
`

const MD = `
# H1
## H2
### H3

:::+ note Lorem
Lorem ipsum dolor, sit amet consectetur adipisicing elit.
Ex, provident! Dolor saepe in eveniet, amet cum velit, nihil unde explicabo beatae obcaecati
laudantium quas voluptates delectus esse, mollitia quis similique!
`

const SCSS = `
h1 {
    color: red;
}
`

const TS = `
console.log('Hello world');
`

const SVG = `
<svg height="100" width="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
  Sorry, your browser does not support inline SVG.
</svg>
`

const isChildOf = (child: string, parent: string) => {
  if (child === parent) return false
  const childs = child.split('/').filter((e) => e.length)
  const parents = parent.split('/').filter((e) => e.length)
  return parents.every((t, i) => childs[i] === t)
}

const SCHEME = 'inmemory'
class MemFile implements IFile {
  uri: monaco.Uri
  url?: string
  content?: string
  readOnly: boolean
  isFolder: boolean

  constructor(type: 'folder' | 'file', autorityAndPath: string, content?: string) {
    this.uri = monaco.Uri.parse(`${SCHEME}://${autorityAndPath}`)
    this.readOnly = false
    this.isFolder = type === 'folder'
    this.content = content
  }

  withPath(path: string): MemFile {
    return new MemFile(this.isFolder ? 'folder' : 'file', path, this.content)
  }
}

export class MemFileProvider extends FileSystemProvider {
  private readonly entries = new Map<string, MemFile>([['/', new MemFile('folder', '/')]])

  readonly scheme = SCHEME
  readonly capabilities =
    FileSystemProviderCapabilities.FileRead |
    FileSystemProviderCapabilities.FileWrite |
    FileSystemProviderCapabilities.FileMove |
    FileSystemProviderCapabilities.FileDelete |
    FileSystemProviderCapabilities.FileSearch |
    FileSystemProviderCapabilities.FileUpload |
    FileSystemProviderCapabilities.FileStat

  readonly roots = [
    monaco.Uri.parse(`${this.scheme}://web/`),
    monaco.Uri.parse(`${this.scheme}://api/`),
    monaco.Uri.parse(`${this.scheme}://docs/`),
  ]

  constructor(size = 10) {
    super()

    this.roots.forEach((root) => {
      for (let i = 1; i <= size; i++) {
        this.entries.set(`${this.scheme}://${root.authority}/`, new MemFile('folder', `${root.authority}/`))
        this.entries.set(`${this.scheme}://${root.authority}/${i}`, new MemFile('folder', `${root.authority}/${i}`))
        this.entries.set(
          `${this.scheme}://${root.authority}/${i}/file.ts`,
          new MemFile('file', `${root.authority}/${i}/file.ts`, TS)
        )
        this.entries.set(
          `${this.scheme}://${root.authority}/${i}/file.scss`,
          new MemFile('file', `${root.authority}/${i}/file.scss`, SCSS)
        )
        this.entries.set(
          `${this.scheme}://${root.authority}/${i}/file.html`,
          new MemFile('file', `${root.authority}/${i}/file.html`, HTML)
        )
        this.entries.set(
          `${this.scheme}://${root.authority}/${i}/file.md`,
          new MemFile('file', `${root.authority}/${i}/file.md`, MD)
        )
        this.entries.set(
          `${this.scheme}://${root.authority}/${i}/file.svg`,
          new MemFile('file', `${root.authority}/${i}/file.svg`, SVG)
        )
      }
    })
  }

  override stat(uri: monaco.Uri): Promise<IFile> {
    const entry = this._lookup(uri, false)
    if (entry) {
      return Promise.resolve(entry)
    }
    throw FileSystemError.FileNotFound(uri)
  }

  override readDirectory(uri: monaco.Uri): Promise<IFile[]> {
    const entry = this._lookupAsDirectory(uri, false)
    const result: IFile[] = [entry]
    for (const f of this.entries.values()) {
      if (
        f.uri.toString(true) !== entry.uri.toString(true) &&
        isChildOf(f.uri.toString(true), entry.uri.toString(true))
      ) {
        result.push(f)
      }
    }
    return Promise.resolve(result)
  }

  override read(uri: monaco.Uri): Promise<string> {
    const file = this._lookupAsFile(uri)
    if (file == null) {
      throw FileSystemError.FileNotFound()
    }
    return Promise.resolve(file.content || '')
  }

  override write(uri: monaco.Uri, content: string, update?: boolean) {
    this._lookupParentDirectory(uri)

    let entry = this._lookup(uri, true)
    if (!entry && update) {
      throw FileSystemError.FileNotFound(uri)
    }

    if (entry && !update) {
      throw FileSystemError.FileExists(uri)
    }

    if (!entry) {
      entry = new MemFile('file', uri.authority + uri.path, content)
      this.entries.set(uri.toString(true), entry)
    } else if (entry.isFolder) {
      throw FileSystemError.FileIsADirectory(uri)
    }

    entry.content = content
  }

  override createDirectory(uri: monaco.Uri) {
    this._lookupParentDirectory(uri)

    const entry = new MemFile('folder', uri.authority + uri.path)
    this.entries.set(uri.toString(true), entry)
  }

  override delete(uri: monaco.Uri) {
    this._lookup(uri, false)
    for (const k of this.entries.keys()) {
      if (k.startsWith(uri.toString(true))) {
        this.entries.delete(k)
      }
    }
  }

  override rename(uri: monaco.Uri, name: string) {
    this._lookup(uri, false)

    const oldPrefix = uri.toString(true)
    const newPrefix = uri.scheme + '://' + uri.authority + Paths.join([Paths.dirname(uri.path), name])
    const entriesKeys = Array.from(this.entries.keys())

    for (const oldId of entriesKeys) {
      if (oldId.startsWith(oldPrefix)) {
        const newUri = monaco.Uri.parse(newPrefix + oldId.substring(oldPrefix.length))
        const oldEntry = this.entries.get(oldId)!
        this.entries.set(newUri.toString(true), oldEntry.withPath(newUri.authority + newUri.path))
        this.entries.delete(oldId)
      }
    }
  }

  override move(source: monaco.Uri, destination: monaco.Uri, options: { copy: boolean }) {
    this._lookup(source, false)
    this._lookup(destination, false)

    const oldPrefix = source.toString(true)
    const oldPrefixDir = Paths.dirname(oldPrefix, false)
    const entriesKeys = Array.from(this.entries.keys())

    for (const oldPath of entriesKeys) {
      if (oldPath.startsWith(oldPrefix + '/') || oldPath === oldPrefix) {
        const newPath = Paths.join([destination.toString(true), oldPath.substring(oldPrefixDir.length)], '/', false)

        const newUri = monaco.Uri.parse(newPath)
        if (this.entries.has(newPath)) {
          throw FileSystemError.FileExists(newPath)
        }

        const entry = this.entries.get(oldPath)!
        this.entries.set(newPath, entry.withPath(newUri.authority + newUri.path))

        if (!options.copy) {
          this.entries.delete(oldPath)
        }
      }
    }
  }

  override upload(file: File, destination: monaco.Uri): Promise<void> {
    this._lookupAsDirectory(destination, false)

    destination = destination.with({
      path: Paths.normalize(Paths.join([destination.path, file.name], '/', false)),
    })

    let entry = this._lookup(destination, true)
    if (entry) {
      throw FileSystemError.FileExists(destination)
    }

    console.log(destination)
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        entry = new MemFile('file', destination.authority + destination.path, content)
        entry.url = URL.createObjectURL(file)
        this.entries.set(destination.toString(true), entry)
        resolve()
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  override search(uri: monaco.Uri, form: SearchForm): Promise<SearchResult<monaco.Uri>[]> {
    this._lookupAsDirectory(uri, false)
    const options: string[] = ['g']
    if (!form.matchCase) {
      options.push('i')
    }

    let query = form.useRegex ? form.query : form.query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    if (form.matchWord) {
      query = `\\b${query}\\b`
    }

    const pattern = new RegExp(query, options.join(''))
    const results: SearchResult<monaco.Uri>[] = []

    for (const entry of this.entries.values()) {
      const a = entry.uri.toString(true)
      const b = uri.toString(true)
      if (a !== b && a.startsWith(b)) {
        if (entry.content) {
          const matches: SearchMatch[] = []
          const lines = entry.content.split('\n')
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            if (pattern.exec(line)) {
              matches.push({
                match: line,
                lineno: i + 1,
              })
            }
          }

          if (matches.length > 0) {
            results.push({
              entry: entry.uri,
              matches,
            })
          }
        }
      }
    }

    return Promise.resolve(results)
  }

  private _lookup(uri: monaco.Uri, silent: boolean): MemFile | undefined {
    const entry = this.entries.get(uri.toString(true))
    if (!entry && !silent) {
      throw FileSystemError.FileNotFound(uri)
    }
    return entry
  }

  private _lookupAsDirectory(uri: monaco.Uri, silent: boolean): MemFile {
    const entry = this._lookup(uri, silent)
    if (entry?.isFolder) {
      return entry
    }
    throw FileSystemError.FileNotADirectory(uri)
  }

  private _lookupAsFile(uri: monaco.Uri): MemFile {
    const entry = this._lookup(uri, false)
    if (entry && !entry.isFolder) {
      return entry
    }

    throw FileSystemError.FileIsADirectory(uri)
  }

  private _lookupParentDirectory(uri: monaco.Uri): MemFile {
    const dirname = uri.with({ path: Paths.dirname(uri.path) })
    return this._lookupAsDirectory(dirname, false)
  }
}
