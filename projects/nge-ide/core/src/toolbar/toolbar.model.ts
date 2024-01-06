import { ICommand } from '../commands';

export enum ToolbarGroups {
  FILE = 'FILE',
  EDIT = 'EDIT',
  SELECTION = 'SELECTION',
  VIEW = 'VIEW',
  GO = 'GO',
}

export interface IToolbarCustomGroup {
  readonly name: string;
  readonly anchor: ToolbarGroups;
  readonly position: 'before' | 'after';
}

export interface IToolbarItem {
  readonly group: string;
  readonly command?: ICommand;
  readonly priority: number;
  readonly isSeparator: boolean;
}

export class ToolbarButton implements IToolbarItem {
  readonly isSeparator = false;
  readonly group: string;
  readonly command: ICommand;
  readonly priority: number;

  constructor(args: {
    group: string;
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
  constructor(readonly group: string, readonly priority: number) {}
}
