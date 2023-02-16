import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { StorageService } from '../../storage/index';
import { IOutputData } from 'angular-split';
import { take } from 'rxjs/operators';
import { IView } from '../view';
import { IViewContainer } from '../view-container';
import { ViewService } from '../view.service';

@Component({
  selector: 'ide-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewGroupComponent {
  readonly minSize = 5;
  private _container?: IViewContainer;

  views: IView[] = [];
  state: State = { sizes: [] };

  @Input()
  direction: 'vertical' | 'horizontal' = 'vertical';

  @Input()
  set container(value: IViewContainer | undefined) {
    this.views = [];
    this._container = value;
    if (value) {
      this.viewService
        .list(value.id)
        .pipe(take(1))
        .subscribe((views) => {
          this.views = views;
          this.detectChanges();
        });
    } else {
      this.detectChanges();
    }
  }

  get container(): IViewContainer | undefined {
    return this._container;
  }

  private get storageId(): string {
    return `${this.container?.id}.state`;
  }

  constructor(
    private readonly viewService: ViewService,
    private readonly storageService: StorageService,
    private readonly changeDetectionRef: ChangeDetectorRef
  ) {}

  //#region TEMPLATE FUNCTIONS
  _dragEnd(data: IOutputData): void {
    this.state = { sizes: data.sizes as number[] };
    this.storageService.set(this.storageId, this.state).subscribe();
    this.changeDetectionRef.detectChanges();
  }

  _toggle(index: number): void {
    const { sizes } = this.state;
    const size = sizes[index];
    if (size <= this.minSize) {
      for (let i = 0; i < sizes.length; i++) {
        sizes[i] = this.minSize;
      }
      sizes[index] = 100 - this.minSize * (sizes.length - 1);
    } else {
      for (let i = 0; i < sizes.length; i++) {
        sizes[i] = (100 - this.minSize) / (sizes.length - 1);
      }
      sizes[index] = this.minSize;
    }
    this.storageService.set(this.storageId, this.state).subscribe();
  }

  _chevron(index: number): string {
    const size = this.state.sizes[index];
    return size <= this.minSize
      ? 'codicon codicon-chevron-right'
      : 'codicon codicon-chevron-down';
  }

  _trackById(_: number, e: any): string {
    return e.id;
  }
  //#endregion

  private detectChanges() {
    this.state = { sizes: new Array(this.views.length).map((_) => 33) };
    this.storageService.get<State>(this.storageId).subscribe((restored) => {
      if (
        restored &&
        restored.sizes &&
        restored.sizes.length === this.state.sizes.length
      ) {
        this.state = restored;
      }
      this.changeDetectionRef.detectChanges();
    });
  }
}

interface State {
  sizes: number[];
}
