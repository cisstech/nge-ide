export const KeyModifiers = {
  ALT: 'altKey',
  SHIFT: 'shiftKey',
  /** CTRL OR CMD */
  CTRL_CMD: 'ctrlKey',
};

/**
 * Checks whether a modifier key is pressed.
 * @param event Event to be checked.
 */
export function hasModifierKey(
  event: KeyboardEvent,
  ...modifiers: string[]
): boolean {
  if (modifiers.length) {
    // metaKey
    return modifiers.every((modifier) => {
      const e = event as any;
      if (modifier === KeyModifiers.CTRL_CMD) {
        return e['ctrlKey'] || e['metaKey'];
      }
      return e[modifier];
    });
  }
  return event.altKey || event.shiftKey || event.ctrlKey || event.metaKey;
}
