export class BinarySize {
  static readonly KB = 1024;
  static readonly MB = BinarySize.KB * BinarySize.KB;
  static readonly GB = BinarySize.MB * BinarySize.KB;
  static readonly TB = BinarySize.GB * BinarySize.KB;

  static formatSize(size: number): string {
    if (size < BinarySize.KB) {
      return `${size}B`;
    }

    if (size < BinarySize.MB) {
      return `${(size / BinarySize.KB).toFixed(2)}KB`;
    }

    if (size < BinarySize.GB) {
      return `${(size / BinarySize.MB).toFixed(2)}MB`;
    }

    if (size < BinarySize.TB) {
      return `${(size / BinarySize.GB).toFixed(2)}GB`;
    }

    return `${(size / BinarySize.TB).toFixed(2)}TB`;
  }
}

// const MAX_OPEN_INTERNAL_SIZE = BinarySize.MB * 200;
