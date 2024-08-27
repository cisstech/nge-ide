export interface SearchForm {
  query: string
  // include?: string;
  // exclude?: string;
  matchWord?: boolean
  matchCase?: boolean
  useRegex?: boolean
}

export interface SearchMatch {
  readonly match: string
  readonly lineno: number
}

export interface SearchResult<T> {
  readonly entry: T
  readonly matches: SearchMatch[]
}

export function emptySearchForm() {
  return {
    query: '',
    // include: '',
    // exclude: '',
    matchWord: false,
    matchCase: false,
    useRegex: false,
  }
}
