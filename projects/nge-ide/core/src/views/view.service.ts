import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IContribution } from '../contributions';
import { IView } from './view';

@Injectable()
export class ViewService implements IContribution {
    private readonly registry = new Map<string, BehaviorSubject<IView[]>>();

    readonly id = 'workbench.contrib.views';

    register(...views: IView[] ): void {
        views.forEach(view => {
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

            entries.push(view);
            subject.next(entries);
            this.registry.set(view.viewContainerId, subject);
        });
    }

    deactivate(): void {
        this.registry.clear();
    }

    list(
        viewContainerId: string
    ): Observable<IView[]> {
        let subject = this.registry.get(viewContainerId);
        if (!subject) {
            subject = new BehaviorSubject<IView[]>([]);
            this.registry.set(viewContainerId, subject);
        }
        return subject.asObservable();
    }
}
