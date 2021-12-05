export declare type NotificationLevel = 'error' | 'info' | 'warn';

export const NOTIFICATION_EVENT_CHANNEL = 'editor.notification';

export interface Notification {
    message: string;
    level: NotificationLevel;
    type: string;
}

export class WarningNotification implements Notification {
    readonly type = 'WarningNotification';
    constructor(
        readonly message: string,
        readonly level: NotificationLevel = 'warn',
        readonly trace?: string
    ) {}
}

export class InfoNotification implements Notification {
    readonly type = 'InfoNotification';
    constructor(
        readonly message: string,
        readonly level: NotificationLevel = 'info',
        readonly trace?: string
    ) {}
}

export class ErrorNotification implements Notification {
    readonly type = 'ErrorNotification';
    constructor(
        readonly message: string,
        readonly level: NotificationLevel = 'error',
        readonly trace?: string
    ) {}
}
