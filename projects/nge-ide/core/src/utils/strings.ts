export function stringToByteArray(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

export function stringFromByArray(input: Uint8Array): string {
    return new TextDecoder().decode(input);
}
