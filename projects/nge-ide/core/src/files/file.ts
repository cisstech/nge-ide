import { URI } from 'vscode-uri';
import { Paths } from '../utils/index';

export interface IFile {
    /**
     * The associated uri for this file | folder.
     *
     * Note that most documents use the `file`-scheme, which means they are files on disk.
     * However, not all files are saved on disk and therefore the `scheme`  must
     * be checked before trying to access the underlying file or siblings on disk.
     */
    uri: URI;

    /**
     * The version of this entry.
     */
    version: any;

    /**
     * Is the entry a directory?
     */
    isFolder: boolean;

    /**
     * Is the entry readonly?
     */
    readOnly: boolean;

    /**
     * Optional download url of the file/folder.
     */
    downloadUrl?: string;
}

export interface IFolder {
    name: string;
    uri: URI;
}

export function resourceId(o: monaco.Uri | URI | IFile): string {
    return asUri(o).toString();
}


export function isResourceParent(
    resource: monaco.Uri | URI | IFile,
    parentCandidate: monaco.Uri | URI | IFile
): boolean {
    const a = asUri(resource);
    const b = asUri(parentCandidate);
    if (resourceId(a) === resourceId(b)) {
        return false;
    }
    return b.fsPath === Paths.dirname(a.fsPath);
}

export function isResourceAncestor(
    resource: monaco.Uri | URI | IFile,
    ancestorCandidate: monaco.Uri | URI | IFile
): boolean {
    const a = asUri(resource);
    const b = asUri(ancestorCandidate);
    if (resourceId(a) === resourceId(b)) {
        return false;
    }
    return a.fsPath.startsWith(b.fsPath);
}

export function isSameResource(
    a: monaco.Uri | URI | IFile,
    b: monaco.Uri | URI | IFile
): boolean {
    return resourceId(a) === resourceId(b);
}



export function asUri(o: monaco.Uri | URI | IFile | string): URI {
    let uri: URI;
    if (typeof o === 'string') {
        uri = URI.parse(o);
    } else {
        uri = 'uri' in o ? o.uri : o;
    }
    return uri.with({
        fragment: '',
        query: ''
    })
}

export function compareURI(a: URI, b: URI) {
    const s1 = a.with({
        fragment: '',
        query: ''
    }).toString();

    const s2 = b.with({
        fragment: '',
        query: '',
    }).toString();

    return s1 === s2;
}
