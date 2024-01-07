import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { IContribution } from '../contributions/index';
import { IView } from './view';
import { ICommand } from '../commands';

type ViewCommand = {
  viewId: string;
  command: ICommand;
}

@Injectable()
export class ViewService implements IContribution {
  private readonly registry = new Map<string, BehaviorSubject<IView[]>>();
  private readonly viewCommandsRegistry = new Map<string, BehaviorSubject<ICommand[]>>();

  readonly id = 'workbench.contrib.views';

  register(...views: IView[]): void {
    views.forEach((view) => {
      let subject = this.registry.get(view.viewContainerId);
      if (!subject) {
        subject = new BehaviorSubject<IView[]>([]);
      }

      const entries = subject.value;
      if (entries.find((v) => v.id === view.id)) {
        throw new Error(
          `There is already a view registered with the id ${view.id}`
        );
      }

      if (!this.viewCommandsRegistry.has(view.id)) {
        this.viewCommandsRegistry.set(view.id, new BehaviorSubject<ICommand[]>([]));
      }

      view.commands = combineLatest([
        this.viewCommandsRegistry.get(view.id)!.asObservable(),
        view.commands
      ]).pipe(
        map(([a, b]) => [...a, ...b])
      )

      entries.push(view);
      subject.next(entries);
      this.registry.set(view.viewContainerId, subject);
    });
  }

  unregister(id: string) {
    for (const [k, v] of this.registry.entries()) {
      v.next(v.value.filter(e => e.id !== id))
    }
  }

  registerCommands(...commands: ViewCommand[]): void {
    commands.forEach((vc) => {
      let subject = this.viewCommandsRegistry.get(vc.viewId);
      if (!subject) {
        subject = new BehaviorSubject<ICommand[]>([]);
      }

      const entries = subject.value;
      if (entries.find((v) => v.id === vc.command.id)) {
        throw new Error(
          `There is already a command registered with the id ${vc.command.id} for view ${vc.viewId}`
        );
      }

      entries.push(vc.command);
      subject.next(entries);
      this.viewCommandsRegistry.set(vc.viewId, subject);
    });
  }

  unregisterCommands(viewId: string, commandId: string) {
    const subject = this.viewCommandsRegistry.get(viewId);
    if (subject) {
      subject.next(subject.value.filter(e => e.id !== commandId));
    }
  }

  deactivate(): void {
    this.registry.clear();
  }

  list(viewContainerId: string): Observable<IView[]> {
    let subject = this.registry.get(viewContainerId);
    if (!subject) {
      subject = new BehaviorSubject<IView[]>([]);
      this.registry.set(viewContainerId, subject);
    }
    return subject.asObservable();
  }
}
