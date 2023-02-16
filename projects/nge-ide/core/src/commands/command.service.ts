import { Injectable, Injector, Type } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IContribution } from '../contributions/index';
import { KeyBindService } from '../keybinding/index';
import { NotificationService } from '../notifications/index';
import { TaskService } from '../tasks/index';
import { ICommand } from './command';
import { CommandEvent } from './command-event';

@Injectable()
export class CommandService implements IContribution {
  private readonly registry = new BehaviorSubject<ICommand[]>([]);
  private readonly subscriptions: Subscription[] = [];

  readonly id = 'workbench.contrib.commands';

  constructor(
    private readonly injector: Injector,
    private readonly eventBus: NgEventBus,
    private readonly taskService: TaskService,
    private readonly notificationService: NotificationService,
    private readonly keybindingService: KeyBindService
  ) {}

  /**
   * Finds and executes the command identified by the given `id`.
   * @param id A command identifier.
   */
  async execute(id: string): Promise<void> {
    if (!id) {
      throw new ReferenceError('missing required parameter: "id"');
    }

    const command = this.find(id);
    if (!command) {
      throw new Error(`undefined command: "${id}"`);
    }
    await command.execute();
  }

  /**
   * Register the given `commands`.
   * @param commands The commands to register.
   * @throws if any of the command is already registered.
   */
  register(...commands: (Type<ICommand> | ICommand)[]): void {
    const registry = this.registry.value;
    commands.forEach((type) => {
      let command: ICommand;
      if (typeof type === 'function') {
        command = this.injector.get(type);
      } else {
        command = type;
      }

      if (registry.find((v) => v.id === command.id)) {
        throw new Error(
          `There is already a command registered with the id ${command.id}`
        );
      }
      this.decorate(command);
      this.registerKeybindings(command);
      registry.unshift(command);
    });
    this.registry.next(registry);
  }

  deactivate(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.registry.next([]);
  }

  find<T extends ICommand>(id: string | Type<ICommand>): T {
    if (!id) {
      throw new ReferenceError('Missing required argument: "id"');
    }

    if (typeof id === 'string') {
      return this.registry.value.find((command) => {
        return command.id === id;
      }) as T;
    }

    return this.registry.value.find((command) => {
      return command.constructor === id;
    }) as T;
  }

  /**
   * Gets an observable that emit with all commands matching the given `predicate`.
   * @param predicate A predicate function that returns true if the command should be returned.
   * @returns An Observable.
   */
  findAll<T extends ICommand>(
    predicate: (command: ICommand) => boolean
  ): Observable<T[]> {
    return this.registry.pipe(
      map((commands) => {
        return commands.filter(predicate);
      })
    ) as Observable<T[]>;
  }

  /**
   * Gets an observable that emit with all commands with an id starting with the given `prefix`.
   * @param prefix Prefix to search for.
   * @returns An Observable.
   */
  findAllByPrefix<T extends ICommand>(prefix: string): Observable<T[]> {
    return this.registry.pipe(
      map((commands) => {
        return commands.filter((e) => e.id.startsWith(prefix));
      })
    ) as Observable<T[]>;
  }

  /**
   * Gets a observable that emit after each execution of the command identified by `commandId`.
   * @param commandId Identifier of the command to listen to.
   * @returns An Observable
   */
  onAfterExecute(commandId?: string): Observable<CommandEvent> {
    return this.eventBus.on<any>(CommandEvent.CHANNEL).pipe(
      map((e) => e.data as CommandEvent),
      filter((e) => {
        return e.when === 'after' && (!commandId || e.commandId === commandId);
      })
    );
  }

  /**
   * Gets a observable that emit before each execution of the command identified by `commandId`.
   * @param commandId Identifier of the command to listen to.
   * @returns An Observable
   */
  onBeforeExecute(commandId?: string): Observable<CommandEvent> {
    return this.eventBus.on<any>(CommandEvent.CHANNEL).pipe(
      map((e) => e.data as CommandEvent),
      filter((e) => {
        return e.when === 'before' && (!commandId || e.commandId === commandId);
      })
    );
  }

  private decorate(command: ICommand) {
    const execute = command.execute;
    const events = this.eventBus;
    command.execute = async (...args) => {
      if (!command.enabled) {
        console.error('cannot run command');
        return;
      }

      const event = new CommandEvent(command.id, command.label, 'before', args);

      events.cast(CommandEvent.CHANNEL, event);
      const task = this.taskService.run(
        `Exécution de la commande : ${command.label}`
      );
      try {
        await execute.apply(command, args);
      } catch (error) {
        this.notificationService.publishError(error);
        throw error;
      } finally {
        task.end();
        setTimeout(() => {
          event.end();
          events.cast(CommandEvent.CHANNEL, event);
        }, 300);
      }
    };
  }

  private registerKeybindings(command: ICommand) {
    if (command.keybinding && typeof command.keybinding !== 'string') {
      const { key, modifiers } = command.keybinding;
      this.subscriptions.push(
        this.keybindingService.match(key, modifiers).subscribe((e) => {
          e.preventDefault();
          e.stopPropagation();
          if (command.enabled) {
            command.execute();
          }
        })
      );
    }
  }
}
