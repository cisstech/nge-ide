import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { IToolbarButton, IToolbarCustomGroup, IToolbarItem, ToolbarGroups } from './toolbar.model'
import { IContribution } from '../contributions/index'
import { ICommand } from '../commands'

@Injectable()
export class ToolbarService implements IContribution {
  readonly id = 'workbench.contrib.toolbar-service'
  private readonly registry = new BehaviorSubject<IToolbarItem[]>([])
  private readonly buttonRegistry = new BehaviorSubject<IToolbarButton[]>([])
  private readonly customGroupRegistry = new BehaviorSubject<IToolbarCustomGroup[]>([])

  deactivate(): void {
    this.registry.next([])
    this.customGroupRegistry.next([])
  }

  register(...items: IToolbarItem[]): void {
    const entries = this.registry.value
    entries.push(...items)
    this.registry.next(entries)
  }

  registerGroup(...items: IToolbarCustomGroup[]): void {
    const entries = this.customGroupRegistry.value
    entries.push(...items)
    this.customGroupRegistry.next(entries)
  }

  registerButton(...buttons: IToolbarButton[]): void {
    const entries = this.buttonRegistry.value
    entries.push(...buttons)
    this.buttonRegistry.next(entries)
  }

  listOfGroup(group: string): Observable<IToolbarItem[]> {
    return this.registry.asObservable().pipe(map((items) => items.filter((item) => item.group === group)))
  }

  listButtons(): Observable<IToolbarButton[]> {
    return this.buttonRegistry.asObservable()
  }

  listCustomGroups(): Observable<IToolbarCustomGroup[]> {
    return this.customGroupRegistry.asObservable()
  }
}
