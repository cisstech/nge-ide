import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IContribution } from '../contributions/index';
import { IViewContainer, ViewContainerScopes } from './view-container';

@Injectable()
export class ViewContainerService implements IContribution {
  private readonly registry = new BehaviorSubject<IViewContainer[]>([]);

  private readonly openArgs = new Map<string, Record<string, any>>();
  private readonly openEvent = new Subject<string>();

  readonly id = 'workbench.contrib.view-container';

  /**
   * Gets the `ViewContainer` registered with the given `scope`.
   * @param scope Scope to filter.
   */
  list<T extends IViewContainer>(scope: ViewContainerScopes): Observable<T[]> {
    return this.registry.pipe(
      map((arr) => arr.filter((v) => v.scope === scope).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    ) as Observable<T[]>;
  }

  /**
   * Registers all the given `containers`.
   * @param containers Containers to register.
   * @throws {Error} if any of the given container is already registered.
   */
  register(...containers: IViewContainer[]): void {
    const entries = this.registry.value;
    containers.forEach((container) => {
      if (entries.find((entry) => entry.id === container.id)) {
        throw new Error(
          `There is already a view container registered with the id ${container.id}`
        );
      }
      entries.push(container);
    });
    this.registry.next(entries);
  }

  unregister(id: string) {
    this.registry.next(
      this.registry.value.filter(e => e.id !== id)
    );
  }

  deactivate(): void {
    this.registry.next([]);
  }

  open(containerId: string, args?: Record<string, any>) {
    if (args) {
      this.openArgs.set(containerId, args);
    }
    this.openEvent.next(containerId);
  }

  onDidOpen(...containerIds: string[]) {
    return this.openEvent.pipe(
      filter((e) => !containerIds.length || containerIds.includes(e))
    );
  }

  consumeArgs(containerId: string): Record<string, any> | undefined {
    const args = this.openArgs.get(containerId);
    if (args) {
      this.openArgs.delete(containerId);
    }
    return args;
  }
}
