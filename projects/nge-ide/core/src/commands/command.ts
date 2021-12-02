import { Icon } from '@mcisse/nge/ui/icon';

/**
 * Areas of the editor where commands can be executed.
 */
export enum CommandScopes {
    INFOBAR = 'INFOBAR',

    EDITOR_GROUP = 'EDITOR_GROUP',

    EXPLORER_TREE = 'EXPLORER_TREE',
    EXPLORER_TITLE_BAR = 'EXPLORER_TITLE_BAR',
    EXPLORER_TREE_HOVER = 'EXPLORER_TREE_HOVER',
}

declare type Scope = string | CommandScopes;

export class Keybinding {
    readonly key: number;
    readonly label: string;
    readonly modifiers?: string[];

    constructor(args: { key: number; label: string; modifiers?: string[] }) {
        this.key = args.key;
        this.label = args.label;
        this.modifiers = args.modifiers;
    }

    toString() {
        return this.label;
    }
}

export interface ICommand {
    /** Unique identifier of the command. */
    readonly id: string;

    /** Optional icon describing the command. */
    readonly icon?: Icon

    /** Area of the editor where the command belongs to */
    readonly scope: Scope[];

    /** Human readable text describing the command. */
    readonly label: string;

    /** Gets a value indicating whether the command is enabled. */
    readonly enabled: boolean;

    /** Keyboard shortcut that will trigger the command. */
    readonly keybinding?: string | Keybinding;

    /**
     * Runs the command (
     *  this method will be decorated by
     *  [CommandService](CommandService) to cancel the execution
     * of the command if condition is not required.
     * ).
     */
    execute(): void | Promise<void>;
}
