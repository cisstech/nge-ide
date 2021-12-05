import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IContribution } from '../contributions/index';
import { IStatusBarItem } from './status-bar.model';

@Injectable()
export class StatusBarService implements IContribution {
    private readonly registry = new BehaviorSubject<IStatusBarItem[]>([]);

    readonly id = 'workbench.contrib.status-bar-service';

    list(): Observable<IStatusBarItem[]> {
        return this.registry.asObservable();
    }

    register(...statusbar: IStatusBarItem[]): void {
        const entries = this.registry.value;
        statusbar.forEach((item) => {
            if (entries.find((entry) => entry.id === item.id)) {
                throw new Error(
                    `There is already a statusbar item registered with the id ${item.id}`
                );
            }
            entries.push(item);
        });
        this.registry.next(entries);
    }

    deactivate(): void {
        this.registry.next([]);
    }
}
