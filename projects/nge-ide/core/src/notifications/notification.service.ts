import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgEventBus } from 'ng-event-bus';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IContribution } from '../contributions/index';
import {
  ErrorNotification,
  Notification,
  NOTIFICATION_EVENT_CHANNEL,
} from './notification';

@Injectable()
export class NotificationService implements IContribution {
  readonly id = 'workbench.contrib.notification-service';

  private readonly subscriptions: Subscription[] = [];
  private readonly subject = new BehaviorSubject<Notification[]>([]);

  get count(): Observable<number> {
    return this.subject.pipe(map((arr) => arr.length));
  }

  get isEmpty(): Observable<boolean> {
    return this.subject.pipe(map((arr) => arr.length === 0));
  }

  get items() {
    return this.subject.asObservable();
  }

  constructor(private readonly eventBus: NgEventBus) {
    this.subscriptions.push(
      this.eventBus
        .on<Notification>(NOTIFICATION_EVENT_CHANNEL)
        .subscribe((e) => {
          const notifications = this.subject.value;
          notifications.unshift(e.data);
          this.subject.next(notifications);
        })
    );
  }

  deactivate(): void {
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
    this.publish(new ErrorNotification(err.message || JSON.stringify(err), 'error', err.stack) || new Error().stack);
  }
}
