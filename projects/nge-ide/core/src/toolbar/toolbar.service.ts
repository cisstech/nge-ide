import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IToolbarCustomGroup, IToolbarItem, ToolbarGroups } from './toolbar.model';
import { IContribution } from '../contributions/index';

@Injectable()
export class ToolbarSevice implements IContribution {
  readonly id = 'workbench.contrib.toolbar-service';
  private readonly registry = new BehaviorSubject<IToolbarItem[]>([]);
  private readonly customGroupRegistry = new BehaviorSubject<IToolbarCustomGroup[]>([]);


  register(...items: IToolbarItem[]): void {
    const entries = this.registry.value;
    entries.push(...items);
    this.registry.next(entries);
  }

  registerGroup(...items: IToolbarCustomGroup[]): void {
    const entries = this.customGroupRegistry.value;
    entries.push(...items);
    this.customGroupRegistry.next(entries);
  }

  deactivate(): void {
    this.registry.next([]);
    this.customGroupRegistry.next([]);
  }

  listOfGroup(group: string): Observable<IToolbarItem[]> {
    return this.registry
      .asObservable()
      .pipe(map((items) => items.filter((item) => item.group === group)));
  }

  listCustomGroups(): Observable<IToolbarCustomGroup[]> {
    return this.customGroupRegistry.asObservable();
  }
}
