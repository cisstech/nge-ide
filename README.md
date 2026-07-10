<!-- markdownlint-disable MD033 -->

<h1 align="center"> NGE IDE</h1>

<div align="center">
  <img src="./projects/demo/src/assets/images/nge.svg" alt="Logo NGE" width="120px" />
</div>

<div align="center">

An extensible and flexible open source ide written in Angular.

[![Tests](https://github.com/cisstech/nge-ide/actions/workflows/ci.yml/badge.svg)](https://github.com/cisstech/nge-ide/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/cisstech/nge-ide/branch/main/graph/badge.svg)](https://codecov.io/gh/cisstech/nge-ide)
[![codefactor](https://www.codefactor.io/repository/github/cisstech/nge-ide/badge/main)](https://www.codefactor.io/repository/github/cisstech/nge-ide/overview/main)
[![GitHub Tag](https://img.shields.io/github/tag/cisstech/nge-ide.svg)](https://github.com/cisstech/nge-ide/tags)
[![npm package](https://img.shields.io/npm/v/@cisstech/nge-ide.svg)](https://www.npmjs.org/package/@cisstech/nge-ide)
[![NPM downloads](http://img.shields.io/npm/dm/@cisstech/nge-ide.svg)](https://npmjs.org/package/@cisstech/nge-ide)
[![licence](https://img.shields.io/github/license/cisstech/nge-ide)](https://github.com/cisstech/nge-ide/blob/main/LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

</div>

## 📄 Docs

Documentation available at [https://cisstech.github.io/nge-ide/](https://cisstech.github.io/nge-ide/)

## 📦 Installation

```bash
npm install @cisstech/nge @cisstech/nge-ide monaco-editor marked
```

### Theme

The IDE ships its own theme and applies it automatically: on startup it injects a scoped stylesheet, and on teardown it removes it. There is nothing to add to your `angular.json` and nothing to copy. The theme is scoped to the IDE (its host element and its own overlays) and never writes to `<body>` or `<html>`, so it stays fully independent of your application's own theme.

Users switch between **Light**, **Dark** and **System** from the theme entry at the bottom of the activity bar, or through the `Basculer le thème de couleur` command in the palette. The choice is persisted and defaults to **System** (it follows the OS `prefers-color-scheme`).

Drive it programmatically with `ThemeService`:

```ts
import { ThemeService } from '@cisstech/nge-ide/core'

const theme = inject(ThemeService)
theme.setMode('dark') // 'light' | 'dark' | 'system'
theme.resolved() // 'light' | 'dark' (system resolved through the OS)
```

To re-brand, override any of the CSS custom properties under the `ide-root` selector (and, for popups, `.ide-theme-light` / `.ide-theme-dark`) in your own global stylesheet.

#### Editor theme

The Monaco editor follows the IDE theme automatically, pairing `github` (light) with `github-dark` (dark). Just make those two themes available to `NgeMonacoModule` (both ship in `NGE_MONACO_THEMES` by default) and leave `darkThemeClassName` unset, so the IDE stays the single source of truth for the editor theme:

```ts
NgeMonacoModule.forRoot({
  theming: {
    themes: NGE_MONACO_THEMES.map((t) => `assets/vendors/nge/monaco/themes/${t}`),
    default: 'github',
  },
})
```

## 🚀 Quick Start

### Basic Integration

Add the IDE to your Angular application by importing the `NgeIdeModule` in your app module:

```typescript
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

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

    NgeIdeModule,
    NgeIdeExplorerModule,
    NgeIdeSearchModule,
    NgeIdeSettingsModule,

    NgeIdeProblemsModule,
    NgeIdeNotificationsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Component Usage

Add the IDE root component to your template:

```html
<ide-root />
```

```ts
import { Component, OnDestroy, OnInit } from '@angular/core'
import { FileService, IdeService, MemFileProvider } from '@cisstech/nge-ide/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-component',
  templateUrl: 'component.component.html',
  styleUrls: ['component.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription?: Subscription

  constructor(
    private readonly ide: IdeService,
    private readonly fileService: FileService
  ) {}

  ngOnInit() {
    this.subscription = this.ide.onAfterStart(() => {
      const provider = new MemFileProvider()
      this.fileService.registerProvider(provider)
      provider.roots.forEach((root) => {
        this.fileService.registerFolders({
          name: root.authority,
          uri: root,
        })
      })
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
```

This basic setup will display the IDE with the default in memory file system and the optional contributions :

- `NgeIdeExplorerModule` : Contribution to navigate the IDE files from the sidebar
- `NgeIdeSearchModule` : Contribution to enable search view
- `NgeIdeSettingsModule`: Contribution to enable settings view
- `NgeIdeProblemsModule` : Contribution to enable problems view in the bottom area.
- `NgeIdeNotificationsModule` : Contribution to enable notifications view in the bottom area.

### Basic File System Setup

In this example configuration, the IDE use an in-memory file system, which is not what you want. You can add your own file system by implementing the `IFileSystemProvider` interface and registering it with the `FileService`.

```typescript
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { FileSystemProvider, FileSystemProviderCapabilities, IFile, FileSystemError } from '@cisstech/nge-ide/core'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class HttpFileSystemProvider extends FileSystemProvider {
  readonly scheme = 'http' // URI scheme for this provider
  readonly capabilities = FileSystemProviderCapabilities.FileRead // Read-only capabilities for this example

  constructor(private readonly http: HttpClient) {
    super()
  }

  // Check if provider has a specific capability
  hasCapability(capability: FileSystemProviderCapabilities): boolean {
    return (this.capabilities & capability) !== 0
  }

  // Implement read method to fetch file content via HTTP
  async read(uri: monaco.Uri): Promise<string> {
    try {
      // Convert IDE URI to actual HTTP URL
      const url = `https://api.myservice.com/files${uri.path}`
      const response = await firstValueFrom(this.http.get(url, { responseType: 'text' }))
      return response
    } catch (error) {
      throw FileSystemError.FileNotFound(uri)
    }
  }

  // Implement stat method to get file metadata
  async stat(uri: monaco.Uri): Promise<IFile> {
    try {
      const url = `https://api.myservice.com/files/stat${uri.path}`
      const response = await firstValueFrom(
        this.http.get<{
          isDirectory: boolean
          name: string
          path: string
        }>(url)
      )

      return {
        uri: uri,
        isFolder: response.isDirectory,
        readOnly: true, // Read-only in this example
        name: response.name,
      }
    } catch (error) {
      throw FileSystemError.FileNotFound(uri)
    }
  }

  // Implement directory listing
  async readDirectory(uri: monaco.Uri): Promise<IFile[]> {
    try {
      const url = `https://api.myservice.com/files/list${uri.path}`
      const response = await firstValueFrom(
        this.http.get<
          Array<{
            isDirectory: boolean
            name: string
            path: string
          }>
        >(url)
      )

      return response.map((item) => ({
        uri: monaco.Uri.parse(`${this.scheme}://${uri.authority}${item.path}`),
        isFolder: item.isDirectory,
        readOnly: true,
        name: item.name,
      }))
    } catch (error) {
      throw FileSystemError.FileNotFound(uri)
    }
  }

  // Implement other methods as needed based on your capabilities
  // write, delete, rename, etc.
}

// Register the provider in a contribution
@Injectable()
export class FileSystemContribution implements IContribution {
  readonly id = 'app.filesystem-contribution'

  constructor(
    private readonly fileService: FileService,
    private readonly httpFileSystemProvider: HttpFileSystemProvider
  ) {}

  activate() {
    // Register the provider
    this.fileService.registerProvider(this.httpFileSystemProvider)

    // Register root folders
    this.fileService.registerFolders([
      {
        name: 'My API Files',
        uri: monaco.Uri.parse('http://api/'),
      },
      {
        name: 'My Documentation',
        uri: monaco.Uri.parse('http://docs/'),
      },
    ])
  }
}

@NgModule({
  providers: [HttpFileSystemProvider, { provide: CONTRIBUTION, multi: true, useClass: FileSystemContribution }],
})
export class AppFileSystemModule {}
```

The example above demonstrates how to implement a simple HTTP-based file system provider. When implementing your own provider, you should:

1. Extend the `FileSystemProvider` class and specify a unique scheme
2. Define which capabilities your provider supports (read, write, delete, etc.)
3. Implement the required methods based on your provider's capabilities
4. Register the provider with the `FileService` in a contribution
5. Register root folders to make them visible in the file explorer

For a complete implementation, you may need to support additional capabilities like file searching, writing, deleting, etc., based on your application's requirements.

## ⌨️ Development

- Clone and install

```bash
git clone https://github.com/cisstech/nge-ide
cd nge-ide
npm install
```

- Serve demo

```bash
npm run start
```

Browser would open automatically at <http://localhost:4200/>.

## 💡 Contribution System Guide

NGE IDE is built around a powerful contribution-based architecture that allows you to enhance and extend the IDE functionality. This guide walks you through understanding and building your own contributions.

### Understanding Contributions

In NGE IDE, a "contribution" is any component, service, or feature that extends the IDE's functionality. Contributions follow a common interface:

```typescript
export interface IContribution {
  readonly id: string; // Unique identifier
  activate?(injector: Injector): void or Promise<void>; // Setup code
  deactivate?(): void or Promise<void>; // Cleanup code
}
```

Contributions are registered using Angular's dependency injection system:

```typescript
@NgModule({
  providers: [{ provide: CONTRIBUTION, multi: true, useClass: MyContribution }],
})
export class MyModule {}
```

### Step 1: Adding Core Contributions

Start with the essential built-in contributions that provide basic IDE functionality:

```typescript
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { NgeIdeModule } from '@cisstech/nge-ide'
import { NgeIdeExplorerModule } from '@cisstech/nge-ide/explorer' // File explorer
import { NgeIdeSearchModule } from '@cisstech/nge-ide/search' // Search functionality
import { NgeIdeSettingsModule } from '@cisstech/nge-ide/settings' // Settings UI

@NgModule({
  imports: [BrowserModule, NgeIdeModule, NgeIdeExplorerModule, NgeIdeSearchModule, NgeIdeSettingsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

This basic setup gives you:

- A fully functional IDE layout with sidebars and panels
- File explorer for navigating your files
- Search capabilities across your codebase
- Settings management interface

### Step 2: Adding File System Support

Next, create a custom file system provider to access your application's files:

```typescript
@Injectable()
export class MyFileSystemContribution implements IContribution {
  readonly id = 'app.file-system'

  constructor(
    private readonly fileService: FileService,
    private readonly httpFs: HttpFileSystemProvider
  ) {}

  activate() {
    // Register the file provider
    this.fileService.registerProvider(this.httpFs)

    // Register root folders to appear in the explorer
    this.fileService.registerFolders({
      name: 'Project Files',
      uri: monaco.Uri.parse('http://my-project/'),
    })
  }
}
```

The `FileService` exposes these key APIs:

- `registerProvider(provider)`: Register a file system provider
- `registerFolders(folders)`: Register root folders to show in explorer
- `open(uri)`, `save(uri)`, `close(uri)`: File operations
- `find(uri)`, `findChildren(file)`: Navigation methods
- `isDirty(uri)`: Check if file has unsaved changes

### Step 3: Adding View Containers and Views

View containers group related views in the IDE sidebars:

```typescript
@Injectable()
export class MyViewContribution implements IContribution {
  readonly id = 'app.my-views'

  activate(injector: Injector) {
    const viewContainerService = injector.get(ViewContainerService)
    const viewService = injector.get(ViewService)

    // 1. Register a container in the sidebar
    viewContainerService.register(
      new (class extends SidebarContainer {
        readonly id = 'app.my-container'
        readonly title = 'My Tools'
        readonly icon = new CodIcon('tools')
        readonly side = 'left' // 'left' or 'right'
        readonly align = 'top' // 'top' or 'bottom'
      })()
    )

    // 2. Register views inside the container
    viewService.register({
      id: 'app.my-view',
      title: 'My View',
      viewContainerId: 'app.my-container',
      component: () => MyViewComponent,
    })
  }
}
```

Key view APIs:

- `ViewContainerService`: Manages containers (sidebars, panels)
- `ViewService`: Manages individual views within containers
- Built-in containers: `leftSideBar`, `rightSideBar`, `bottomPanel`

### Step 4: Adding Commands

Commands are actions that can be triggered by users through menus, buttons, keyboard shortcuts or api calls to command service:

```typescript
@Injectable()
export class MyCommandContribution implements IContribution {
  readonly id = 'app.my-commands'

  constructor(
    private readonly commandService: CommandService,
    private readonly toolbarService: ToolbarService
  ) {}

  activate() {
    // 1. Create and register a command
    const myCommand: ICommand = {
      id: 'app.myCommand',
      label: 'Do Something',
      icon: new CodIcon('zap'),
      get enabled() {
        return true
      },
      execute: () => {
        console.log('Command executed!')
      },
    }

    this.commandService.register(myCommand)

    // 2. Add the command to the editor toolbar
    this.toolbarService.register(
      new ToolbarButton({
        group: ToolbarGroups.EDIT, // Predefined toolbar groups
        command: myCommand,
        priority: 10,
      })
    )
  }
}
```

Command system APIs:

- `CommandService`: Register and execute commands
- `ToolbarService`: Add buttons to editor toolbars
- `KeyBindService`: Register keyboard shortcuts
- Predefined toolbar groups: `FILE`, `EDIT`, `SELECTION`, `VIEW`, `GO`
- Use command as angular service to access to dependency injection in the constructor.

### Step 5: Editor Enhancements

Enhance the editor with custom functionality:

```typescript
@Injectable()
export class MyEditorContribution implements IContribution {
  readonly id = 'app.editor-contrib'

  constructor(
    private readonly editorService: EditorService,
    private readonly monacoService: MonacoService,
    private readonly previewService: PreviewService
  ) {}

  activate() {
    // 1. Register custom file editors
    this.editorService.registerEditors(new MyCustomEditor())

    // 2. Register custom preview handlers for files
    this.previewService.register(new ImagePreviewHandler())

    // 3. Listen for editor events
    this.monacoService.onDidCreateEditor.subscribe((editor) => {
      // Configure the Monaco editor instance
      editor.updateOptions({ lineNumbers: 'on' })
    })

    // 4. Register editor commands
    this.editorService.registerCommands(MyEditorCommandClass)
  }
}
```

Editor APIs:

- `EditorService`: Manage editors and editor groups
- `MonacoService`: Direct access to Monaco editor instances
- `PreviewService`: Register preview handlers for files

### Step 6: Other API Services

NGE IDE provides several other services for building rich IDE features:

```typescript
@Injectable()
export class MyAdvancedContribution implements IContribution {
  readonly id = 'app.advanced'

  constructor(
    private readonly notificationService: NotificationService,
    private readonly dialogService: DialogService,
    private readonly statusBarService: StatusBarService,
    private readonly taskService: TaskService,
    private readonly diagnosticService: DiagnosticService,
    private readonly settingsService: SettingsService
  ) {}

  activate() {
    // Show notifications
    this.notificationService.publish(new InfoNotification('IDE initialized'))

    // Add item to status bar
    this.statusBarService.register({
      id: 'app.status.item',
      side: 'right',
      priority: 10,
      content: 'Ready',
      tooltip: 'System status',
    })

    // Report diagnostics for a file
    const uri = monaco.Uri.parse('file:///myfile.ts')
    this.diagnosticService.setDiagnostics(uri, [
      {
        message: 'Variable not used',
        severity: DiagnosticSeverity.Warning,
        range: {
          start: { lineNumber: 5, column: 10 },
          end: { lineNumber: 5, column: 15 },
        },
      },
    ])

    // Run background task with progress
    const task = this.taskService.run('Processing files')
    setTimeout(() => task.end(), 3000)

    // Access or modify settings
    this.settingsService.set('editor', 'fontSize', 14)
  }
}
```

Additional available services:

- `NotificationService`: Show notifications to users
- `DialogService`: Display modal dialogs
- `StatusBarService`: Add items to the status bar
- `TaskService`: Run and track background tasks
- `DiagnosticService`: Report problems in files
- `SettingsService`: Manage user/workspace settings

### Putting It All Together

A complete module that contributes a file system, views, and commands:

```typescript
@NgModule({
  imports: [NgeIdeModule, NgeIdeExplorerModule, NgeIdeSearchModule],
  declarations: [MyViewComponent],
  providers: [
    MyFileSystemProvider,
    { provide: CONTRIBUTION, multi: true, useClass: MyFileSystemContribution },
    { provide: CONTRIBUTION, multi: true, useClass: MyViewContribution },
    { provide: CONTRIBUTION, multi: true, useClass: MyCommandContribution },
    { provide: CONTRIBUTION, multi: true, useClass: MyEditorContribution },
  ],
})
export class MyIDEFeatureModule {}
```

This progressive approach allows you to build up your IDE's functionality layer by layer, from basic file system access to rich editor features, all through the unified contribution system.

## 🤝 Contribution

Contributions are always welcome. <br/>

Please read our [CONTRIBUTING.md](https://github.com/cisstech/nge-ide/blob/main/CONTRIBUTING.md) first. You can submit any ideas as [pull requests](https://github.com/cisstech/nge-ide/pulls) or as [GitHub issues](https://github.com/cisstech/nge-ide/issues).

Please just make sure that ...

Your code style matches with the rest of the project

Unit tests pass

Linter passes

## ❓ Support Development

The use of this library is totally free.

As the owner and primary maintainer of this project, I am putting a lot of time and effort beside my job, my family and my private time to bring the best support I can by answering questions, addressing issues and improving the library to provide more and more features over time.

If this project has been useful, that it helped you or your business to save precious time, don't hesitate to give it a star to support its maintenance and future development.

## ✨ License

MIT © [Mamadou Cisse](https://github.com/cisstech)
