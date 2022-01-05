import { Icon } from '@mcisse/nge/ui/icon';


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
