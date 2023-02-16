import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IToolbarItem, ToolbarGroups } from './toolbar.model';
import { IContribution } from '../contributions/index';

@Injectable()
export class ToolbarSevice implements IContribution {
  readonly id = 'workbench.contrib.toolbar-service';
  private readonly registry = new BehaviorSubject<IToolbarItem[]>([]);

  register(...items: IToolbarItem[]): void {
    const entries = this.registry.value;
    entries.push(...items);
    this.registry.next(entries);
  }

  deactivate(): void {
    this.registry.next([]);
  }

  listOfGroup(group: ToolbarGroups): Observable<IToolbarItem[]> {
    return this.registry
      .asObservable()
      .pipe(map((items) => items.filter((item) => item.group === group)));
  }
}
