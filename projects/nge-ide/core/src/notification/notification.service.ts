import { Injectable, OnDestroy } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import {
    BehaviorSubject,
    Observable,
    PartialObserver,
    Subscription,
} from 'rxjs';
import {
    Notification,
    ErrorNotification,
    NOTIFICATION_EVENT_CHANNEL,
} from './notification';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class NotificationService implements OnDestroy {
    private readonly subscriptions: Subscription[] = [];
    private readonly subject = new BehaviorSubject<Notification[]>([]);


    get count(): Observable<number> {
        return this.subject.pipe(
            map(arr => arr.length)
        );
    }

    get isEmpty(): Observable<boolean> {
        return this.subject.pipe(
            map(arr => arr.length === 0)
        );
    }

    get items() {
        return this.subject.asObservable();
    };

    constructor(
        private readonly eventBus: NgEventBus
    ) {
        this.subscriptions.push(
            this.eventBus.on<Notification>(NOTIFICATION_EVENT_CHANNEL).subscribe((e) => {
                const notifications = this.subject.value;
                notifications.unshift(e.data);
                this.subject.next(notifications);
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((e) => e.unsubscribe());
    }

    clear(): void {
        this.subject.next([]);
    }

    publish(notification: Notification): void {
        this.eventBus.cast(NOTIFICATION_EVENT_CHANNEL, notification);
    }

    publishError(err: any): void {
        if (err == null) {
            return;
        }

        if (err instanceof Error) {
            this.publish(
                new ErrorNotification(err.message, 'error', err.stack)
            );
        } else if (!(err instanceof HttpErrorResponse)) {
            this.publish(
                new ErrorNotification(
                    JSON.stringify(err),
                    'error',
                    new Error().stack
                )
            );
        }
    }
}
