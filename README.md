<!-- markdownlint-disable MD033 -->

<h1 align="center"> NGE IDE</h1>

<div align="center">
  <img src="./projects/demo/src/assets/images/nge.svg" alt="Logo NGE" width="120px" />
</div>

<div align="center">

An extensible, file-system-agnostic code editor for the web, built with Angular.

[![Tests](https://github.com/cisstech/nge-ide/actions/workflows/ci.yml/badge.svg)](https://github.com/cisstech/nge-ide/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/cisstech/nge-ide/branch/main/graph/badge.svg)](https://codecov.io/gh/cisstech/nge-ide)
[![codefactor](https://www.codefactor.io/repository/github/cisstech/nge-ide/badge/main)](https://www.codefactor.io/repository/github/cisstech/nge-ide/overview/main)
[![GitHub Tag](https://img.shields.io/github/tag/cisstech/nge-ide.svg)](https://github.com/cisstech/nge-ide/tags)
[![npm package](https://img.shields.io/npm/v/@cisstech/nge-ide.svg)](https://www.npmjs.org/package/@cisstech/nge-ide)
[![NPM downloads](http://img.shields.io/npm/dm/@cisstech/nge-ide.svg)](https://npmjs.org/package/@cisstech/nge-ide)
[![licence](https://img.shields.io/github/license/cisstech/nge-ide)](https://github.com/cisstech/nge-ide/blob/main/LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

</div>

## Overview

NGE IDE embeds the shell of a desktop code editor (a file explorer, tabbed Monaco
editors, side panels and a status bar) into an Angular application, behind a
single `<ide-root />`. It does not assume where your files live: you register a
file system provider, and you extend the workbench with your own commands, views
and editors through a small contribution system.

## Packages

Everything ships as one npm package with several entry points:

| Entry point                       | Description                                                        |
| --------------------------------- | ------------------------------------------------------------------ |
| `@cisstech/nge-ide`               | The IDE shell rendered by `<ide-root />`.                          |
| `@cisstech/nge-ide/core`          | Services and the file-system, editor, contribution and theme APIs. |
| `@cisstech/nge-ide/explorer`      | File-tree explorer in the sidebar.                                 |
| `@cisstech/nge-ide/search`        | Search across a file system that supports it.                      |
| `@cisstech/nge-ide/settings`      | Settings editor and its sidebar entry.                             |
| `@cisstech/nge-ide/problems`      | Diagnostics panel in the info bar.                                 |
| `@cisstech/nge-ide/notifications` | Notifications panel in the info bar.                               |

## Compatibility

The major version of nge-ide tracks Angular and `@cisstech/nge`.

| nge-ide | Angular | @cisstech/nge | Node                    |
| ------- | ------- | ------------- | ----------------------- |
| 22.x    | 22.x    | 22.x          | ^20.19, ^22.12 or >= 24 |
| 18.x    | 18.x    | 18.x          | ^18 or ^20              |

## Installation

```bash
npm install @cisstech/nge @cisstech/nge-ide monaco-editor marked
```

Monaco loads its workers and themes at runtime, so copy `@cisstech/nge`'s Monaco
assets into your build. The [Getting started](https://cisstech.github.io/nge-ide/docs/getting-started)
guide covers the full setup.

## Documentation

Guides, API reference and a live playground are at
[cisstech.github.io/nge-ide](https://cisstech.github.io/nge-ide).

## Development

```bash
git clone https://github.com/cisstech/nge-ide
cd nge-ide
yarn install
yarn start
```

- `yarn build:lib` builds the library.
- `yarn test` runs the unit tests.
- `yarn lint` runs the linter.

## Contributing

Issues and pull requests are welcome. Please open an issue to discuss substantial
changes first.

## Support

If this project is useful to you, a star on
[GitHub](https://github.com/cisstech/nge-ide) is appreciated.

## License

MIT © [Mamadou Cisse](https://github.com/cisstech)
