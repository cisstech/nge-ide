import { URI } from 'vscode-uri';

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
