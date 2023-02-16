import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IStatusBarItem, StatusBarService } from '@cisstech/nge-ide/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ide-statusbar',
  templateUrl: './statusbar.component.html',
  styleUrls: ['./statusbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusbarComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  private empty = false;

  leftViews: IStatusBarItem[] = [];
  rightViews: IStatusBarItem[] = [];

  get isEmpty(): boolean {
    return this.empty;
  }

  constructor(
    private readonly statusBarService: StatusBarService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.statusBarService.list().subscribe((items) => {
        this.leftViews = items
          .filter((e) => e.side === 'left')
          .sort((a, b) => {
            return (b.priority || 0) - (a.priority || 0);
          });
        this.rightViews = items
          .filter((e) => e.side === 'right')
          .sort((a, b) => {
            return (b.priority || 0) - (a.priority || 0);
          });
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  track(_: number, item: IStatusBarItem) {
    return item.id;
  }
}
