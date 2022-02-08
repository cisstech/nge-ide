import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import {
    InfobarContainer,
    IView,
    ViewContainerScopes,
    ViewContainerService,
    ViewService,
} from '@cisstech/nge-ide/core';
import { Subscription } from 'rxjs';

const CLOSED_SIZE = 5;
const OPENED_SIZE = 25;

@Component({
    selector: 'ide-infobar',
    templateUrl: './infobar.component.html',
    styleUrls: ['./infobar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfobarComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];
    private viewSubcription?: Subscription;
    private empty = false;

    /** Current size of the infobar */
    @Input()
    size: number = OPENED_SIZE;

    @Output()
    sizeChange = new EventEmitter<number>();

    /** Containers to display inside the infobar. */
    containers: InfobarContainer[] = [];
    /** Index of the active container */
    activeContainerIndex = 0;
    /** Current active view of the `activeContainer`. */
    activeContainerView?: IView;
    /** Views of the `activeContainer`. */
    activeContainerViews: IView[] = [];

    /**
     * Gets a value indicating whether there is any registered
     * container inside the infobar.
     */
    get isEmpty(): boolean {
        return this.empty;
    }

    constructor(
        private readonly viewService: ViewService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly viewContainerService: ViewContainerService
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.viewContainerService
                .list<InfobarContainer>(ViewContainerScopes.infobar)
                .subscribe(this.onChangeContainers.bind(this))
        );

        this.subscriptions.push(
            this.viewContainerService.onDidOpen().subscribe(containerId => {
                const container = this.containers.find(c => c.id === containerId);
                if (container) {
                    this.setActiveContainer(container);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.viewSubcription?.unsubscribe();
    }

    setActiveView(activeId: string) {
        this.activeContainerView = this.activeContainerViews.find((v) => v.id === activeId);
        this.changeDetectorRef.markForCheck();
    }

    setActiveContainer(container: InfobarContainer): void {
        this.activeContainerIndex = this.containers.findIndex(
            (e) => e.id === container.id
        );

        if (this.size <= OPENED_SIZE / 2) {
            this.size = OPENED_SIZE / 2;
            this.sizeChange.emit(this.size);
        }

        this.changeDetectorRef.markForCheck();

        this.viewSubcription?.unsubscribe();
        this.viewSubcription = this.viewService.list(container.id).subscribe((views) => {
            this.activeContainerViews = views;
            this.activeContainerView = views.find(_ => true);
            this.changeDetectorRef.markForCheck();
        });
    }

    trackById(_: number, item: any): string {
        return item.id;
    }

    private onChangeContainers(containers: InfobarContainer[]): void {
        this.empty = !containers.length;
        this.activeContainerViews = [];
        this.containers = containers;
        this.activeContainerView = undefined;

        if (!this.empty) {
            this.setActiveContainer(containers[0]);
        }

        this.changeDetectorRef.markForCheck();
    }
}
