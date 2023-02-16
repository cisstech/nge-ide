import { ICommand } from '../commands';

export enum ToolbarGroups {
  FILE = 'FILE',
  EDIT = 'EDIT',
  SELECTION = 'SELECTION',
  VIEW = 'VIEW',
  GO = 'GO',
}

export interface IToolbarItem {
  readonly group: ToolbarGroups;
  readonly command?: ICommand;
  readonly priority: number;
  readonly isSeparator: boolean;
}

export class ToolbarButton implements IToolbarItem {
  readonly isSeparator = false;
  readonly group: ToolbarGroups;
  readonly command: ICommand;
  readonly priority: number;
  constructor(args: {
    group: ToolbarGroups;
    command: ICommand;
    priority: number;
  }) {
    this.group = args.group;
    this.command = args.command;
    this.priority = args.priority;
  }
}

export class ToolbarSeparator implements IToolbarItem {
  readonly shorcut = '';
  readonly isSeparator = true;
  constructor(readonly group: ToolbarGroups, readonly priority: number) {}
}
