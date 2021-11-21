export interface SearchQuery {
    readonly path: string;
    readonly query: string;
    readonly exclude?: string;
    readonly matchWord?: boolean;
    readonly matchCase?: boolean;
    readonly useRegex?: boolean;
}

export interface SearchMatch {
    readonly match: string;
    readonly lineno: number;
}

export interface SearchResult<T> {
    readonly entry: T;
    readonly matches: SearchMatch[];
}
