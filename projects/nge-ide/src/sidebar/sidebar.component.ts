import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  IdeService,
  StorageService,
  SidebarContainer,
  ViewContainerScopes,
  ViewContainerService,
  SettingsService,
} from '@cisstech/nge-ide/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

const CLOSED_SIZE = 48;
const OPENED_SIZE = 320;

/**
 * Renders on the sidebar area of the ide.
 */
@Component({
  selector: 'ide-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  private empty = false;
  private state: State = {
    size: OPENED_SIZE,
    active: '',
    order: [],
  };

  /** Current size of the sidebar */
  size = OPENED_SIZE;

  /** Current active container */
  active?: SidebarContainer;

  /** Container aligned to the top of the activity bar */
  top: SidebarContainer[] = [];

  /** Container aligned to the bottom of the activity bar */
  bottom: SidebarContainer[] = [];

  /** Horizontal position of the component in the app */
  @Input()
  @HostBinding('class')
  side: 'left' | 'right' = 'left';

  @HostBinding('attr.role')
  role = 'navigation';

  /**
   * Gets a value indicating whether there is any registered
   * container inside the sidebar.
   */
  get isEmpty(): boolean {
    return this.empty;
  }

  /** Storage key of the sidebar state object. */
  get storageId(): string {
    return 'sidebar.state.' + this.side;
  }

  constructor(
    private readonly ideService: IdeService,
    private readonly storageService: StorageService,
    private readonly changeDetectionRef: ChangeDetectorRef,
    private readonly viewContainerService: ViewContainerService,
    private readonly settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.settingsService.activate();
    this.restoreState()
      .then(() => {
        this.subscriptions.push(
          this.viewContainerService
            .list<SidebarContainer>(ViewContainerScopes.sidebar)
            .pipe(map((arr) => arr.filter((e) => e.side === this.side)))
            .subscribe(this.onChangeContainers.bind(this))
        );

        this.subscriptions.push(
          this.ideService.onBeforeStop(this.saveState.bind(this))
        );

        this.subscriptions.push(
          this.viewContainerService.onDidOpen().subscribe((containerId) => {
            const container =
              this.top.find((c) => c.id === containerId) ||
              this.bottom.find((c) => c.id === containerId);
            if (container) {
              this.setActive(container, true);
            }
          })
        );
      })
      .catch(console.error);
  }

  ngOnDestroy(): void {
    this.saveState();
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.settingsService.deactivate();
  }

  trackById(_: number, item: any): string {
    return item.id;
  }

  /**
   * Toggles the opening state of the sidebar.
   */
  toggle() {
    this.size = this.size === OPENED_SIZE ? CLOSED_SIZE : OPENED_SIZE;

    this.changeDetectionRef.detectChanges();
  }

  reorder(event: CdkDragDrop<SidebarContainer[]>): void {
    moveItemInArray(this.top, event.previousIndex, event.currentIndex);
    this.changeDetectionRef.detectChanges();
  }

  /**
   * Gets a value indicating whether the given `view` is the active one inside the sidebar.
   * @param view The view to test.
   */
  isActive(view: SidebarContainer): boolean {
    return this.active?.id === view.id;
  }

  /**
   * Sets the given `view` as the active one and toggles the opening state unless `open` is set to `true`.
   * @param container The view to activate.
   * @param open Whether to open the sidebar if it is closed.
   */
  async setActive(container: SidebarContainer, open?: boolean): Promise<void> {
    if (container.onClickHandler) {
      await container.onClickHandler();
      return;
    }

    if (this.isActive(container) && !open) {
      this.toggle();
    } else {
      this.active = container;
    }
    this.changeDetectionRef.markForCheck();
  }

  private saveState(): void {
    this.storageService
      .set(this.storageId, {
        size: this.size,
        order: this.top.map((e) => e.id),
        active: this.active ? this.active.id : '',
      })
      .subscribe();
  }

  private async restoreState(): Promise<void> {
    const defaultSizeSetting = this.settingsService.get('ide.layout', 'toggleSideBar')?.value;
    const defaultSize = defaultSizeSetting === 'opened' ? OPENED_SIZE : CLOSED_SIZE;
    this.size = defaultSize;

    this.state = await lastValueFrom(
      this.storageService
        .get<State>(this.storageId, {
          size: defaultSize,
          order: [],
          active: '',
        })
        .pipe(take(1))
    );
  }

  private onChangeContainers(containers: SidebarContainer[]): void {
    this.empty = !containers.length;
    this.active = undefined;
    this.top = containers.filter((v) => v.align === 'top');
    this.bottom = containers.filter((v) => v.align === 'bottom');

    this.top.sort((a, b) => {
      const i = this.state.order.indexOf(a.id);
      const j = this.state.order.indexOf(b.id);
      if (i === -1 || j === -1) {
        return 0;
      }
      return i - j;
    });

    if (!this.empty) {
      const active =
        containers.find((v) => {
          return v.id === this.state.active;
        }) || containers.find((v) => !v.onClickHandler);
      if (active) {
        this.setActive(active);
      }
    }

    this.changeDetectionRef.markForCheck();
  }
}

interface State {
  size: number;
  order: string[];
  active: string;
}
