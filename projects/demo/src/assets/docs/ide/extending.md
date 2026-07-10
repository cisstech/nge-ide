# Extending the IDE

Every feature in nge-ide is a **contribution**. The explorer, search, settings
and the built-in editors are all contributions, and yours are added the same way.
A contribution is a small object with an `id` and an `activate` method that runs
once, on startup, with access to the injector.

## A contribution

```ts
import { CONTRIBUTION, IContribution } from '@cisstech/nge-ide/core'
import { Injectable, Injector, NgModule } from '@angular/core'

@Injectable()
export class MyContribution implements IContribution {
  readonly id = 'my.contribution'

  activate(injector: Injector): void {
    // register commands, views, toolbar buttons, editors, ...
  }

  deactivate(): void {
    // optional: clean up
  }
}

@NgModule({
  providers: [MyContribution, { provide: CONTRIBUTION, multi: true, useExisting: MyContribution }],
})
export class MyFeatureModule {}
```

`IdeService.start()` calls `activate` on every registered contribution;
`stop()` calls `deactivate`. Inside `activate` you reach any service through the
`injector`. The sections below are the things you will register.

## Commands

A command has an `id`, a `label`, an `enabled` flag and an `execute` method, plus
an optional icon and keybinding. Register it on the `CommandService`:

```ts
import { CommandService, ICommand, Keybinding, KeyCodes, KeyModifiers } from '@cisstech/nge-ide/core'
import { CodIcon } from '@cisstech/nge/ui/icon'

class SayHelloCommand implements ICommand {
  readonly id = 'my.commands.hello'
  readonly label = 'Say hello'
  readonly icon = new CodIcon('smiley')
  readonly enabled = true
  readonly keybinding = new Keybinding({ key: KeyCodes.KEY_H, label: '⌘ H', modifiers: [KeyModifiers.CTRL_CMD] })

  execute(): void {
    console.log('hello')
  }
}

// in activate():
injector.get(CommandService).register(new SayHelloCommand())
```

The `CommandService` binds the keybinding for you and wraps `execute` with error
handling. Run a command by id with `commandService.execute('my.commands.hello')`.

## Toolbar buttons

The top toolbar is organised into groups (`ToolbarGroups`: `FILE`, `EDIT`,
`SELECTION`, `VIEW`, `GO`). Place a command on it with a `ToolbarButton`:

```ts
import { ToolbarButton, ToolbarGroups, ToolbarService } from '@cisstech/nge-ide/core'

injector.get(ToolbarService).register(new ToolbarButton({ group: ToolbarGroups.VIEW, command: new SayHelloCommand() }))
```

## Sidebar views

The left and right sidebars hold **view containers**. A `SidebarContainer` is an
icon in the activity bar with a title, a side (`left`/`right`) and an alignment
(`top`/`bottom`). A container can open a panel (a registered `IView`), run an
action directly (`onClickHandler`), or show a `dropdown` menu.

```ts
import { SidebarContainer, ViewContainerService } from '@cisstech/nge-ide/core'
import { CodIcon, Icon } from '@cisstech/nge/ui/icon'

class MyPanelContainer extends SidebarContainer {
  readonly id = 'my.view-container'
  readonly title = 'My panel'
  readonly icon: Icon = new CodIcon('beaker')
  readonly side = 'left' as const
  readonly align = 'top' as const
}

injector.get(ViewContainerService).register(new MyPanelContainer())
```

Register the panel content itself with the `ViewService` (an `IView` bound to the
container id), and read how the explorer and search modules do it for a complete
example.

## Status bar and info bar

The status bar (bottom strip) takes `IStatusBarItem`s. Each has a `side`, an
observable `content` (an HTML string, so codicons work) and an optional `action`:

```ts
import { StatusBarService } from '@cisstech/nge-ide/core'
import { of } from 'rxjs'

injector.get(StatusBarService).register({
  id: 'my.status-item',
  side: 'right',
  active: of(true),
  content: of('<span class="codicon codicon-heart"></span> ready'),
  tooltip: 'Everything is fine',
  action: () => console.log('clicked'),
})
```

The **info bar** is the panel area below the editors (where Problems and
Notifications live). Contribute a tab by registering an `InfobarContainer` on the
`ViewContainerService` with the `infobar` scope, then a matching `IView`.

## Putting it together

A feature module usually provides one contribution whose `activate` registers a
command, a toolbar button and a view container, then declares itself as a
`CONTRIBUTION`. That single pattern covers most of what you will build on top of
nge-ide.
