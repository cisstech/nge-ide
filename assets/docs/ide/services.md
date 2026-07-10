# Services reference

The services below are exported from `@cisstech/nge-ide/core`. Inject them where
you need them (most often inside a contribution's `activate`). This page lists
each one and its main entry points; read the source for the full signatures.

## Lifecycle

**`IdeService`** drives startup and shutdown. `start()` loads Monaco and activates
every contribution; `stop()` deactivates them. `onAfterStart(fn)` and
`onBeforeStop(fn)` register callbacks, and `started` is an observable of the
running state.

## Files and editors

**`FileService`** owns the file model and the provider registry.
`registerProvider`, `registerFolders`, `find` / `findAll` / `findChildren`,
`open`, `update`, `save`, `close`, `createFile`, `createDirectory`, `rename`,
`delete`, `move`, `copy`, `upload`, `search`, `isDirty`, `hasCapability`. Change
streams: `treeChange`, `onWillSaveFile` / `onDidSaveFile`, `onDidChangeFile`,
`contentChange(uri)`. See [File system](/docs/file-system).

**`EditorService`** opens resources in editor groups. `registerEditors`, `open`,
`close`, `closeAll`, `saveAll`, `saveActiveResource`, `isOpened`,
`setActiveGroup`; getters `activeEditor`, `activeResource`, `activeGroup`,
`visibleEditors`; observables `state`, `editorGroups`, `onDidOpen`. See
[Editors](/docs/editors).

**`MonacoService`** integrates Monaco. `open(options)`, `findLanguage(uri)`,
`onDidCreateEditor`, and getters for the current `cursor`, `activeEditor` and
`activeLanguage`.

## Commands and input

**`CommandService`** is the command registry. `register`, `execute(id)`,
`find(id)`, `findAll(predicate)`, `findAllByPrefix(prefix)`, `onBeforeExecute` /
`onAfterExecute`.

**`KeyBindService`** matches keyboard shortcuts. `match(key, modifiers?)` returns
an observable of matching events; use the `KeyCodes`, `KeyModifiers` and
`Keybinding` helpers.

## Layout

**`ViewContainerService`** registers sidebar and info-bar containers.
`register`, `unregister`, `list(scope)`, `open(containerId, args?)`,
`onDidOpen(...ids)`.

**`ViewService`** registers the views shown inside a container. `register`,
`unregister`, `list(containerId)`, `registerCommands`.

**`ToolbarService`** manages the top toolbar. `register`, `registerButton`,
`registerGroup`, `listOfGroup(group)`.

**`StatusBarService`** manages the bottom status bar. `register(item)`, `list()`.

**`NotificationService`** publishes notifications. `publish`, `publishError`,
`clear`, with `items$`, `count$`, `isEmpty$`.

**`DiagnosticService`** holds per-file diagnostics. `setDiagnostics(uri, list)`,
`asObservable(uri)`, `asObservableAll()`, `clear()`, plus counters `errors`,
`warnings`, `count`.

## Settings and storage

**`SettingsService`** stores structured, persisted settings (backed by
localStorage). `register`, `get(group, name)`, `set(group, name, value)`,
`update`, `getAll`, `onDidChange$`. Registered settings appear in the Settings
editor.

**`StorageService`** is a small typed wrapper over `@ngx-pwa/local-storage`.
`get`, `set`, `remove`, `clear`, `watch`, plus `getString` / `getNumber` /
`getBoolean`.

## Other

**`TaskService`** reports background progress. `run(label)` returns a task with an
`end()` method and drives the task bar; `current` is an observable.

**`ThemeService`** owns the color theme. `setMode`, `mode`, `resolved`, `cycle`.
See [Theming](/docs/theming).

**`DialogService`** shows a confirmation dialog. `confirmAsync(options)` resolves
with the user's choice.
