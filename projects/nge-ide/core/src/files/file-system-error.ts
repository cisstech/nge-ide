import { URI } from 'vscode-uri';

/**
 * A type that filesystem providers should use to signal errors.
 * This class has factory methods for common error-cases, like FileNotFound when a file or folder doesn't exist,
 */
export class FileSystemError extends Error {
    /**
     * Create an error to signal that a file or folder wasn't found.
     * @param messageOrUri Message or uri.
     */
    static FileNotFound(messageOrUri?: string | URI): FileSystemError {
        return new FileSystemError('FileNotFound: ' + messageOrUri);
    }

    /**
     * Create an error to signal that a file or folder already exists, e.g. when
     * creating but not overwriting a file.
     * @param messageOrUri Message or uri.
     */
    static FileExists(messageOrUri?: string | URI): FileSystemError {
        return new FileSystemError('FileExists: ' + messageOrUri);
    }

    /**
     * Create an error to signal that a file is not a folder.
     * @param messageOrUri Message or uri.
     */
    static FileNotADirectory(messageOrUri?: string | URI): FileSystemError {
        return new FileSystemError('FileNotADirectory: ' + messageOrUri);
    }

    /**
     * Create an error to signal that a file is a folder.
     * @param messageOrUri Message or uri.
     */
    static FileIsADirectory(messageOrUri?: string | URI): FileSystemError {
        return new FileSystemError('FileIsADirectory: ' + messageOrUri);
    }

    /**
     * Create an error to signal that an operation lacks required permissions.
     * @param messageOrUri Message or uri.
     */
    static NoPermissions(messageOrUri?: string | URI): FileSystemError {
        return new FileSystemError('NoPermissions: ' + messageOrUri);
    }

    /**
     * Create an error to signal that the file system is unavailable or too busy to
     * complete a request.
     * @param messageOrUri Message or uri.
     */
    static Unavailable(messageOrUri?: string | URI): FileSystemError {
        return new FileSystemError('Unavailable: ' + messageOrUri);
    }

    /**
     * Creates a new filesystem error.
     *
     * @param messageOrUri Message or uri.
     */
    constructor(messageOrUri?: string | URI) {
        super(messageOrUri?.toString());
    }
}
