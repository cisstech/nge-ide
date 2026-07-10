# Getting started

This page gets an IDE running on an in-memory file system. It assumes an existing
Angular application.

## Install

```bash
npm install @cisstech/nge @cisstech/nge-ide monaco-editor marked
```

`@cisstech/nge` provides the Monaco and Markdown integrations the IDE builds on;
`monaco-editor` and `marked` are their peer dependencies.

## Register the modules

Import `NgeIdeModule` (the shell) and the optional feature modules you want, plus
`NgeMonacoModule` for the editor:

```ts
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgeMonacoModule } from '@cisstech/nge/monaco'

import { NgeIdeModule } from '@cisstech/nge-ide'
import { NgeIdeExplorerModule } from '@cisstech/nge-ide/explorer'
import { NgeIdeSearchModule } from '@cisstech/nge-ide/search'
import { NgeIdeSettingsModule } from '@cisstech/nge-ide/settings'
import { NgeIdeProblemsModule } from '@cisstech/nge-ide/problems'
import { NgeIdeNotificationsModule } from '@cisstech/nge-ide/notifications'

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgeMonacoModule.forRoot({ theming: { default: 'github' } }),

    NgeIdeModule,
    NgeIdeExplorerModule,
    NgeIdeSearchModule,
    NgeIdeSettingsModule,
    NgeIdeProblemsModule,
    NgeIdeNotificationsModule,
  ],
})
export class AppModule {}
```

Every feature module is optional and self-registering: drop `NgeIdeSearchModule`
and the search view simply disappears. See [Extending the IDE](/docs/extending)
for how that works, and the [entry-point table](/docs/introduction) for what each
one provides.

## Copy Monaco's assets

Monaco loads its workers and themes at runtime, so copy `@cisstech/nge`'s assets
into your build in `angular.json`:

```json
{
  "glob": "**/*",
  "input": "./node_modules/@cisstech/nge/assets/monaco",
  "output": "./assets/vendors/nge/monaco/"
}
```

Point `NgeMonacoModule.forRoot` at them if you use a custom theme list; the
default `github` theme works out of the box.

## Mount the IDE

`<ide-root />` renders the whole workbench. It fills its container, so give it
room (for example `height: 100vh`):

```html
<ide-root />
```

## Feed it a file system

The IDE shows nothing until a **file system provider** is registered. For a quick
start, use the built-in in-memory provider. Register it once the IDE has started,
then declare the folders to show in the explorer:

```ts
import { Component, OnDestroy, OnInit } from '@angular/core'
import { FileService, IdeService, MemFileProvider } from '@cisstech/nge-ide/core'
import { Subscription } from 'rxjs'

@Component({ selector: 'app-root', template: '<ide-root />' })
export class AppComponent implements OnInit, OnDestroy {
  private subscription?: Subscription

  constructor(
    private readonly ide: IdeService,
    private readonly fileService: FileService
  ) {}

  ngOnInit(): void {
    this.subscription = this.ide.onAfterStart(() => {
      const provider = new MemFileProvider()
      this.fileService.registerProvider(provider)
      provider.roots.forEach((root) => {
        this.fileService.registerFolders({ name: root.authority, uri: root })
      })
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
```

That is a working IDE. To back it with your own storage instead of the in-memory
tree, continue to [File system](/docs/file-system).

## Theming

The theme is built in and applied automatically, so there is nothing to add to
`angular.json`. Users switch between light, dark and system from the bottom of
the activity bar. See [Theming](/docs/theming) to drive or re-brand it.
