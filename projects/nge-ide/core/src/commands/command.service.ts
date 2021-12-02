import { Injectable, Injector, Type } from '@angular/core';
import { ICommand, CommandScopes } from './command';
import { filter, map } from 'rxjs/operators';
import { NgEventBus } from 'ng-event-bus';
import { CommandEvent } from './command-event';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IContribution } from '../contributions';
import { KeyBindService } from '../keybinding';

@Injectable()
export class CommandService implements IContribution {
    private readonly registry = new BehaviorSubject<ICommand[]>([]);
    private readonly subscriptions: Subscription[] = [];

    readonly id = 'workbench.contrib.commands';

    constructor(
        private readonly injector: Injector,
        private readonly eventBus: NgEventBus,
        private readonly keybindingService: KeyBindService,
    ) { }

    /**
     * Finds and executes the command identified by the given `id`.
     * @param id A command identifier.
     */
    async execute(
        id: string
    ): Promise<void> {
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
    register(
        ...commands: Type<ICommand>[]
    ): void {
        const registry = this.registry.value;
        commands.forEach((type) => {
            const command = this.injector.get(type);
            if (registry.find((v) => v.id === command.id)) {
                throw new Error(
                    `There is already a command registered with the id ${command.id}`
                );
            }
            this.decorate(command);
            this.registerKeybindings(command);
            registry.push(command);
        });
        this.registry.next(registry);
    }

    deactivate(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.registry.next([]);
    }

    find<T extends ICommand>(
        id: string | Type<ICommand>
    ): T {
        if (!id) {
            throw new ReferenceError('Missing required argument: "id"');
        }

        if (typeof id === 'string') {
            return this.registry.value.find(command => {
                return command.id === id;
            }) as T;
        }

        return this.registry.value.find(command => {
            return command.constructor === id;
        }) as T;
    }

    findAll<T extends ICommand>(
        predicate: (command: ICommand) => boolean
    ): Observable<T[]> {
        return this.registry.pipe(
            map(commands => {
                return commands.filter(predicate)
            })
        ) as Observable<T[]>;
    }

    findAllByPrefix<T extends ICommand>(
        prefix: string
    ): Observable<T[]> {
        return this.registry.pipe(
            map(commands => {
                return commands.filter(e => e.id.startsWith(prefix))
            })
        ) as Observable<T[]>;
    }

    findAllByScope<T extends ICommand>(
        scope: CommandScopes
    ): Observable<T[]> {
        return this.registry.pipe(
            map(commands => {
                return commands.filter(e => e.scope.includes(scope))
            })
        ) as Observable<T[]>;
    }

    forEachCommandInScope<T extends ICommand>(
        scope: CommandScopes,
        consumer: (command: T) => void
    ): void {
        this.registry.value.forEach(e => {
            if (e.scope.includes(scope)) {
                consumer(e as T);
            }
        });
    }

    onAfterExecute(commandId?: string): Observable<CommandEvent> {
        return this.eventBus.on<any>(CommandEvent.CHANNEL).pipe(
            map(e => e.data as CommandEvent),
            filter(e => {
                return e.when === 'after' && (!commandId || (e.commandId === commandId));
            })
        );
    }

    onBeforeExecute(commandId?: string): Observable<CommandEvent> {
        return this.eventBus.on<any>(CommandEvent.CHANNEL).pipe(
            map(e => e.data as CommandEvent),
            filter(e => {
                return e.when === 'before' && (!commandId || (e.commandId === commandId));
            })
        );
    }

    private decorate(command: ICommand) {
        const run = command.execute;
        const events = this.eventBus;
        command.execute = async (...args) => {
            if (!command.enabled) {
                console.error('cannot run command');
                return;
            }

            const event = new CommandEvent(
                command.id,
                command.label,
                'before',
                args
            );

            events.cast(CommandEvent.CHANNEL, event);
            try {
                await run.apply(command, args);
            } finally {
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
            this.subscriptions.push(this.keybindingService.match(key, modifiers).subscribe((e) => {
                if (command.enabled) {
                    command.execute();
                }
            }));
        }
    }
}
