import { ICommand } from "../commands";

export enum ToolbarGroups {
    FILE = "FILE",
    EDIT = "EDIT",
    SELECTION = "SELECTION",
    VIEW = "VIEW",
}

export interface IToolbarItem {
    readonly group: ToolbarGroups;
    readonly shorcut: string;
    readonly command?: ICommand;
    readonly isSeparator: boolean;
}

export class ToolbarButton implements IToolbarItem {
    readonly isSeparator = false;
    constructor(
        readonly group: ToolbarGroups,
        readonly command: ICommand,
        readonly shorcut = ''
    ) {}
}

export class ToolbarSeparator implements IToolbarItem {
    readonly shorcut = '';
    readonly isSeparator = true;
    constructor(readonly group: ToolbarGroups) {}
}
