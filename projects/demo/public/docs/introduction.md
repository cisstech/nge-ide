# Introduction

NGE IDE is an embeddable code editor for Angular applications. It provides the
shell of a desktop editor (a file explorer, tabbed Monaco editors, a status bar
and side panels) as a set of Angular modules you mount behind a single
`<ide-root />`.

It does not assume where your files live. Instead of a fixed file system, you
register a file system provider, so the same IDE can edit an in-memory tree,
files served over HTTP, or any storage you can put behind a small interface.

## What it provides

- A Monaco-based editor with tabs, split view and a preview editor.
- A pluggable file system: implement one interface to back the IDE with your own
  storage.
- A contribution system to add commands, toolbar buttons, sidebar views,
  status-bar items and custom editors.
- A built-in light / dark / system theme, scoped so it does not affect the host
  application.

## Scope

nge-ide focuses on editing files. It does not currently include:

- an integrated terminal, debugger or task runner;
- version-control (git) integration;
- a general command palette (the quick-open, `Ctrl`/`Cmd`+`O`, is a file switcher);
- an i18n layer: the built-in labels are in French, and you replace them through
  your own contributions.

## How it fits together

- **Shell**: `<ide-root />` lays out the toolbar, sidebars, editor area, info
  panel and status bar.
- **Contributions**: every feature (the explorer, search, settings, and the
  built-in editors) is a contribution activated on startup. Yours are added the
  same way.
- **File system**: a `FileService` fronts one or more providers, keyed by URI
  scheme.
- **Editors**: an `EditorService` opens each resource in the first editor that
  can handle it.
- **Views and bars**: the sidebars, info bar and status bar are populated through
  services you register against.

The [next page](/docs/getting-started) gets an IDE running; the rest of the guide
covers each system in turn.
