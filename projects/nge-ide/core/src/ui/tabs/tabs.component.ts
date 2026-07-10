import { FocusKeyManager } from '@angular/cdk/a11y'
import { NgTemplateOutlet } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  OnDestroy,
  TemplateRef,
  contentChildren,
  effect,
  inject,
  input,
  model,
  viewChildren,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { TabButtonDirective } from './tab-button.directive'
import { TabComponent } from './tab.component'

/** Visual style of the tab bar (renamed from ng-zorro's `nzType`). */
export type IdeTabsType = 'line' | 'card'

let nextUniqueId = 0

/**
 * Card-style (or line-style) tab bar. Standalone replacement for ng-zorro's
 * `nz-tabs`, hosting {@link TabComponent} children.
 *
 * - {@link selectedIndex} is two-way bindable (renamed from `nzSelectedIndex`).
 * - {@link tabBarExtraContent} renders a template at the trailing edge of the
 *   bar (renamed from `nzTabBarExtraContent`).
 * - Keyboard navigation follows the WAI-ARIA tabs pattern with `tablist` /
 *   `tab` / `tabpanel` roles: the CDK `FocusKeyManager` provides roving
 *   tabindex, Arrow-Left/Right move (and activate) tabs, and Home/End jump to
 *   the first/last tab.
 *
 * @example
 * ```html
 * <ide-tabs type="card" [(selectedIndex)]="index" [tabBarExtraContent]="extra">
 *   <ide-tab [title]="titleTpl" (tabClick)="open()"></ide-tab>
 * </ide-tabs>
 * ```
 */
@Component({
  selector: 'ide-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, TabButtonDirective],
  host: {
    class: 'ide-tabs',
    '[class.ide-tabs--card]': "type() === 'card'",
    '[class.ide-tabs--line]': "type() === 'line'",
  },
})
export class TabsComponent implements AfterViewInit, OnDestroy {
  private readonly injector = inject(Injector)
  private readonly destroyRef = inject(DestroyRef)

  /** Zero-based index of the active tab (two-way, renamed from `nzSelectedIndex`). */
  readonly selectedIndex = model<number>(0)

  /** Tab bar style (renamed from `nzType`). */
  readonly type = input<IdeTabsType>('card')

  /** Template rendered at the trailing edge of the bar (renamed from `nzTabBarExtraContent`). */
  readonly tabBarExtraContent = input<TemplateRef<unknown>>()

  /** Tabs declared as content children. */
  protected readonly tabs = contentChildren(TabComponent)

  /** Header elements consumed by the focus key manager for roving tabindex. */
  private readonly tabButtons = viewChildren(TabButtonDirective)

  /** Stable prefix wiring each tab to its panel via `aria-controls` / `aria-labelledby`. */
  protected readonly baseId = `ide-tabs-${nextUniqueId++}`

  private keyManager?: FocusKeyManager<TabButtonDirective>

  constructor() {
    // Mirror external selection changes onto the roving-tabindex anchor without
    // stealing focus or re-emitting activation events.
    effect(() => {
      const index = this.selectedIndex()
      this.keyManager?.updateActiveItem(index)
    })
  }

  ngAfterViewInit(): void {
    this.keyManager = new FocusKeyManager<TabButtonDirective>(this.tabButtons, this.injector)
      .withHorizontalOrientation('ltr')
      .withVerticalOrientation(false)
      .withWrap()
      .withHomeAndEnd()

    // Arrow/Home/End move focus and, per the automatic-activation pattern, also
    // select the newly focused tab.
    this.keyManager.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((index) => this.activate(index))

    this.keyManager.updateActiveItem(this.selectedIndex())
  }

  ngOnDestroy(): void {
    this.keyManager?.destroy()
  }

  /** Element id for the tab header at `index`. */
  protected tabId(index: number): string {
    return `${this.baseId}-tab-${index}`
  }

  /** Element id for the tabpanel at `index`. */
  protected panelId(index: number): string {
    return `${this.baseId}-panel-${index}`
  }

  /** Returns the value as a `TemplateRef` when it is one, otherwise `null`. */
  protected asTemplate(value: string | TemplateRef<unknown> | undefined): TemplateRef<unknown> | null {
    return value instanceof TemplateRef ? value : null
  }

  /** Delegates Arrow/Home/End keys pressed on the tablist to the focus key manager. */
  protected onTabListKeydown(event: KeyboardEvent): void {
    this.keyManager?.onKeydown(event)
  }

  /** Handles a pointer activation of the tab at `index`. */
  protected onTabClick(index: number): void {
    this.keyManager?.updateActiveItem(index)
    this.activate(index)
  }

  private activate(index: number): void {
    const tab = this.tabs()[index]
    if (!tab) {
      return
    }
    this.selectedIndex.set(index)
    tab.tabClick.emit()
  }
}
