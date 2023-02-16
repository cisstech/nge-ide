import { Observable } from 'rxjs';

export interface IStatusBarItem {
  readonly id: string;
  readonly side: 'left' | 'right';
  readonly tooltip?: string;

  active: Observable<boolean>;
  content: Observable<string>;
  priority?: number;
  action?(): void | Promise<void>;
}
