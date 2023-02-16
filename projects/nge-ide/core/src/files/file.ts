/**
 * Representation of a file/directory.
 */
export interface IFile {
  /**
   * The associated uri for this file/directory.
   *
   * Notes: the uri must not end with a slash except for a root uri.
   */
  readonly uri: monaco.Uri;

  /**
   * Is the file a directory?
   */
  readonly isFolder: boolean;

  /**
   * Is the file readonly?
   */
  readonly readOnly: boolean;

  /**
   * Optional download url of the file.
   */
  readonly url?: string;
}
