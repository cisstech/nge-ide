/** Represents the severity of diagnostics. */
export enum DiagnosticSeverity {
  /** Something to inform about but not a problem. */
  Info = 'Info',
  /** Something to hint to a better way of doing it, like proposing a refactoring. */
  Hint = 'Hint',
  /** Something not allowed by the rules of a language or other means. */
  Error = 'Error',
  /** Something suspicious but allowed. */
  Warning = 'Warning',
}

/**
 * Represents a diagnostic, such as a compiler error or warning.
 * Diagnostic objects are only valid in the scope of a file.
 */
export interface Diagnostic {
  /** The range to which this diagnostic applies. */
  range: {
    start: monaco.IPosition
    end: monaco.IPosition
  }
  /** The human-readable message. */
  message: string
  /** The severity. */
  severity: DiagnosticSeverity
}

export interface DiagnosticGroup {
  uri: string
  diagnostics: Diagnostic[]
}
