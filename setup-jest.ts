// https://thymikee.github.io/jest-preset-angular/docs/getting-started/installation/

import 'jest-preset-angular/setup-jest';
import { TextEncoder, TextDecoder } from 'util'

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder, writable: true },
  TextEncoder: { value: TextEncoder, writable: true },
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});

Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance'],
    };
  },
});

/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});
