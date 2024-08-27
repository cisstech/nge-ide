const BINARIES = [
  '3dm',
  '3ds',
  '3g2',
  '3gp',
  '7z',
  'a',
  'aac',
  'adp',
  'ai',
  'aif',
  'aiff',
  'alz',
  'ape',
  'apk',
  'appimage',
  'ar',
  'arj',
  'asf',
  'au',
  'avi',
  'bak',
  'baml',
  'bh',
  'bin',
  'bk',
  'bmp',
  'btif',
  'bz2',
  'bzip2',
  'cab',
  'caf',
  'cgm',
  'class',
  'cmx',
  'cpio',
  'cr2',
  'cur',
  'dat',
  'dcm',
  'deb',
  'dex',
  'djvu',
  'dll',
  'dmg',
  'dng',
  'doc',
  'docm',
  'docx',
  'dot',
  'dotm',
  'dra',
  'DS_Store',
  'dsk',
  'dts',
  'dtshd',
  'dvb',
  'dwg',
  'dxf',
  'ecelp4800',
  'ecelp7470',
  'ecelp9600',
  'egg',
  'eol',
  'eot',
  'epub',
  'exe',
  'f4v',
  'fbs',
  'fh',
  'fla',
  'flac',
  'flatpak',
  'fli',
  'flv',
  'fpx',
  'fst',
  'fvt',
  'g3',
  'gh',
  'gif',
  'graffle',
  'gz',
  'gzip',
  'h261',
  'h263',
  'h264',
  'icns',
  'ico',
  'ief',
  'img',
  'ipa',
  'iso',
  'jar',
  'jpeg',
  'jpg',
  'jpgv',
  'jpm',
  'jxr',
  'key',
  'ktx',
  'lha',
  'lib',
  'lvp',
  'lz',
  'lzh',
  'lzma',
  'lzo',
  'm3u',
  'm4a',
  'm4v',
  'mar',
  'mdi',
  'mht',
  'mid',
  'midi',
  'mj2',
  'mka',
  'mkv',
  'mmr',
  'mng',
  'mobi',
  'mov',
  'movie',
  'mp3',
  'mp4',
  'mp4a',
  'mpeg',
  'mpg',
  'mpga',
  'mxu',
  'nef',
  'npx',
  'numbers',
  'nupkg',
  'o',
  'odp',
  'ods',
  'odt',
  'oga',
  'ogg',
  'ogv',
  'otf',
  'ott',
  'pages',
  'pbm',
  'pcx',
  'pdb',
  'pdf',
  'pea',
  'pgm',
  'pic',
  'png',
  'pnm',
  'pot',
  'potm',
  'potx',
  'ppa',
  'ppam',
  'ppm',
  'pps',
  'ppsm',
  'ppsx',
  'ppt',
  'pptm',
  'pptx',
  'psd',
  'pya',
  'pyc',
  'pyo',
  'pyv',
  'qt',
  'rar',
  'ras',
  'raw',
  'resources',
  'rgb',
  'rip',
  'rlc',
  'rmf',
  'rmvb',
  'rpm',
  'rtf',
  'rz',
  's3m',
  's7z',
  'scpt',
  'sgi',
  'shar',
  'snap',
  'sil',
  'sketch',
  'slk',
  'smv',
  'snk',
  'so',
  'stl',
  'suo',
  'sub',
  'swf',
  'tar',
  'tbz',
  'tbz2',
  'tga',
  'tgz',
  'thmx',
  'tif',
  'tiff',
  'tlz',
  'ttc',
  'ttf',
  'txz',
  'udf',
  'uvh',
  'uvi',
  'uvm',
  'uvp',
  'uvs',
  'uvu',
  'viv',
  'vob',
  'war',
  'wav',
  'wax',
  'wbmp',
  'wdp',
  'weba',
  'webm',
  'webp',
  'whl',
  'wim',
  'wm',
  'wma',
  'wmv',
  'wmx',
  'woff',
  'woff2',
  'wrm',
  'wvx',
  'xbm',
  'xif',
  'xla',
  'xlam',
  'xls',
  'xlsb',
  'xlsm',
  'xlsx',
  'xlt',
  'xltm',
  'xltx',
  'xm',
  'xmind',
  'xpi',
  'xpm',
  'xwd',
  'xz',
  'z',
  'zip',
  'zipx',
]

export class Paths {
  /**
   * Returns the extension of the path (in lowercase), from the last '.' to end of string in the last portion of the path.
   * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string
   * @param path the path to evaluate
   * @returns the extension in lowercase (without a dot) or an empty string.
   */
  static extname(path: string) {
    if (path == null) {
      throw new ReferenceError('"path" is required')
    }

    const base = Paths.basename(path)
    if (!base) {
      return base
    }
    if (base.startsWith('.')) {
      return ''
    }
    const dotIndex = base.lastIndexOf('.')
    if (dotIndex === -1) {
      return ''
    }
    return base.substring(dotIndex + 1).toLowerCase()
  }

  /**
   * Returns the directory name of a path. Similar to the Unix dirname command.
   * @param path the path to evaluate
   * @param normalize: If true, the path will be normalized by removing multiple following slashes and unnecessary separators.
   */
  static dirname(path: string, normalize: boolean = true) {
    if (path == null) {
      throw new ReferenceError('"path" is required')
    }

    path = normalize ? Paths.normalize(path.replace(/\\/g, '/')) : path
    let head = path.slice(0, path.lastIndexOf('/') + 1)
    if (head && !head.match(/^\/*$/g)) {
      head = head.replace(/\/*$/g, '')
    }
    return head
  }

  /**
   * Returns the last portion of a path. Similar to the Unix basename command.
   * Often used to extract the file name from a fully qualified path.
   * @param the path to evaluate.
   */
  static basename(path: string) {
    if (path == null) {
      throw new ReferenceError('"path" is required')
    }

    path = Paths.normalize(path.replace(/\\/g, '/'))
    return path.slice(path.lastIndexOf('/') + 1, path.length)
  }

  /**
   * Join several segments into one path
   * @param parts: the segments
   * @param sep: path separator
   * @param normalize: If true, the path will be normalized by removing multiple following slashes and unnecessary separators.
   */
  static join(parts: string[], sep: string = '', normalize: boolean = true) {
    if (parts == null) {
      throw new ReferenceError('"parts" is required')
    }

    parts = parts.filter(Boolean)
    sep = sep || '/'
    const separator = sep || '/'
    const replace = new RegExp(separator + '{1,}', 'g')
    if (normalize) {
      return parts.join(separator).replace(replace, separator)
    } else {
      return parts.join(separator)
    }
  }

  // https://github.com/jonschlinkert/normalize-path/blob/master/index.js
  /**
   * Normalize slashes in a file path to be posix/unix-like forward slashes.
   * Also condenses repeat slashes to a single slash and removes and trailing slashes, unless disabled.
   * @param path path to normalize
   * @param stripTrailing remove trailing slashes
   */
  static normalize(path: string, stripTrailing: boolean = true) {
    if (typeof path !== 'string') {
      throw new TypeError('expected path to be a string')
    }

    if (path === '\\' || path === '/') {
      return '/'
    }

    const len = path.length
    if (len <= 1) {
      return path
    }

    // ensure that win32 namespaces has two leading slashes, so that the path is
    // handled properly by the win32 version of path.parse() after being normalized
    // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces
    let prefix = ''
    if (len > 4 && path[3] === '\\') {
      const ch = path[2]
      if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
        path = path.slice(2)
        prefix = '//'
      }
    }
    const segs = path.split(/[/\\]+/)
    if (stripTrailing !== false && segs[segs.length - 1] === '') {
      segs.pop()
    }
    return prefix + segs.join('/')
  }

  static isAbsolutePath(path: string): boolean {
    return !!path && path[0] === '/'
  }

  /**
   * Determines whether the given path is a binary file path.
   * @param path the path to test.
   * @returns
   */
  static isBinaryFile(path: string): boolean {
    return BINARIES.includes(Paths.extname(path))
  }
}
