# Editors

An **editor** is the component that renders an open resource. When you ask the
IDE to open a URI, the `EditorService` walks the registered editors and hands the
resource to the first one that says it can handle it. That is how a `.ts` file
opens in Monaco while a `.png` opens in the media viewer.

## Opening resources

```ts
constructor(private readonly editorService: EditorService) {}

open(uri: monaco.Uri) {
  this.editorService.open(uri, { title: 'My file', position: { line: 10, column: 1 } })
}
```

`OpenOptions` covers the common cases: `title`, `tooltip`, `icon`, `openToSide`,
a `position` to reveal, `diff` for a diff view, and `preview` to open through a
preview handler (see below). Editors live in **groups** (`EditorGroup`), one
active tab per group, and `openToSide` opens a second group beside the current
one.

## Built-in editors

Registered by the workbench out of the box:

- **Code editor**: Monaco. Handles any resource the file system can resolve.
- **Media editor**: handles files exposing a `url` with an audio, video or image
  extension (`mp3`, `mp4`, `png`, `svg`, …).
- **Preview editor**: handles resources opened with `{ preview }`; the rendered
  output comes from a preview handler.
- **Settings editor**: provided by `@cisstech/nge-ide/settings`; opens the
  settings UI at `editor://settings`.

### Preview handlers

The preview editor delegates rendering to a `PreviewHandler` registered on the
`PreviewService`. The library ships handlers for **SVG**, **HTML** and
**Markdown**; register your own to preview other formats.

## Writing a custom editor

Extend `Editor` and implement two things: `component` (the Angular component to
render, loaded lazily) and `canHandle` (whether this editor takes the request).

```ts
import { Editor, OpenRequest } from '@cisstech/nge-ide/core'

export class JsonFormEditor extends Editor {
  component = () => import('./json-form.component').then((m) => m.JsonFormComponent)

  canHandle(request: OpenRequest): boolean {
    return request.uri.path.endsWith('.form.json')
  }
}
```

Then register it, typically from a contribution's `activate` (see
[Extending the IDE](/docs/extending)):

```ts
activate(injector: Injector) {
  injector.get(EditorService).registerEditors(new JsonFormEditor())
}
```

Two things worth knowing:

- Editors are matched **newest-registered first**, so a later registration can
  take precedence over a built-in editor for the same files.
- Each group instantiates its own copy of an editor (`new editor.constructor()`),
  so your editor class must be **default-constructible**: take dependencies
  through the rendered component's DI, not the editor's constructor.

The rendered component receives the resource through its `editor` input and reads
or writes content through the `FileService`.
