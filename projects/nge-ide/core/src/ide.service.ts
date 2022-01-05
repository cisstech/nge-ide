import { Injectable, Injector } from '@angular/core';
import { NgeMonacoLoaderService } from '@mcisse/nge/monaco';
import { fromEvent, PartialObserver, Subject, Subscription } from 'rxjs';
import { CONTRIBUTION, IContribution } from './contributions/index';
import { FileService } from './files/index';

declare type Observer<T> = () => (T | Promise<T>) | PartialObserver<T | Promise<T>>;

@Injectable()
export class IdeService {
    private readonly subscriptions: Subscription[] = [];
    private readonly didAfterStart = new Subject<void>();
    private readonly didBeforeStop = new Subject<void>();

    constructor(
        private readonly injector: Injector,
    ) { }

    /**
     * Start the ide application.
     *
     * Start up consists of the following steps:
     * - start the contributions
     * - attach an listener to window object handle beforeunload event.
     */
    async start() {
        const monacoLoaderService = this.injector.get(NgeMonacoLoaderService);
        await monacoLoaderService.loadAsync();
        await this.startContributions();

        const fileService = this.injector.get(FileService);
        this.subscriptions.push(
            fromEvent(window, 'beforeunload').subscribe(e => {
                if (fileService.isDirty()) {
                    // IMPORTANT THE IF IS REQUIRED
                    e.preventDefault();
                    e.returnValue = true;
                } else {
                    this.didBeforeStop.next();
                }
            })
        );
        this.didAfterStart.next();
    }

    /**
     * Stop the ide application.
     *
     * Stop up consists of the following steps:
     * - emit onBeforeStop event.
     * - stop the contributions
     * - dispose event listeners and subscriptions.
     */
    async stop() {
        this.didBeforeStop.next();
        await this.stopContributions();
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }

    /**
     * Subscribe to an event emitted after the editor starts.
     * @param observer Subcription function.
     */
    onAfterStart(observer: Observer<void>) {
        return this.didAfterStart.subscribe(observer)
    }

    /**
     * Subscribe to an event emitted before the editor stops.
     * @param observer Subcription function.
     */
    onBeforeStop(observer: Observer<void>) {
        return this.didBeforeStop.subscribe(observer)
    }

    private async startContributions(): Promise<void> {
        console.log('>>> Starting contributions...');
        const contributions = this.injector.get<IContribution[]>(CONTRIBUTION, []);
        await Promise.all(
            contributions.map(async (contrib) => {
                try {
                    if (contrib.activate) {
                        await contrib.activate(this.injector);
                    }
                } catch (error) {
                    console.error(`Could not start contribution "${contrib.id}"`, error);
                }
            })
        );
        console.log('>>> All contributions have been started.');
    }

    private async stopContributions(): Promise<void> {
        console.log('>>> Stopping contributions...');
        const contributions = this.injector.get<IContribution[]>(CONTRIBUTION, []);
        await Promise.all(
            contributions.map(async (contrib) => {
                try {
                    if (contrib.deactivate) {
                        await contrib.deactivate();
                    }
                } catch (error) {
                    console.error(`Could not stop contribution "${contrib.id}"`, error);
                }
            })
        );
        console.log('>>> All contributions have been stopped.');
    }

}
