import {
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  Injectable,
  InjectionToken,
  Injector,
  TemplateRef,
  inject,
  runInInjectionContext,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { ComponentPortal } from '@angular/cdk/portal'
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay'
import { CdkMenu, MENU_STACK, MENU_TRIGGER, MenuStack } from '@angular/cdk/menu'
import { Subscription } from 'rxjs'

/** A menu source: a bare `TemplateRef`, or an object that carries one. */
export type IdeContextMenuContent = TemplateRef<unknown> | { readonly templateRef: TemplateRef<unknown> }

/** Options accepted by {@link ContextMenuService.open}. */
export interface IdeContextMenuConfig {
  /** Context object exposed to the menu template. */
  readonly context?: Record<string, unknown>
  /** Move keyboard focus to the first item when the menu opens. Defaults to `true`. */
  readonly autoFocus?: boolean
  /** Positions to try, relative to the pointer. Defaults to a VS-Code-like set. */
  readonly positions?: ConnectedPosition[]
}

/** Preferred placements relative to the pointer: below-right first, then flip. */
const CONTEXT_MENU_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetX: 2, offsetY: 2 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetX: 2, offsetY: -2 },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetX: -2, offsetY: 2 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetX: -2, offsetY: -2 },
]

const MENU_OVERLAY_TEMPLATE = new InjectionToken<TemplateRef<unknown>>('ide-menu-overlay-template')
const MENU_OVERLAY_CONTEXT = new InjectionToken<Record<string, unknown> | null>('ide-menu-overlay-context')
const MENU_OVERLAY_INJECTOR = new InjectionToken<Injector>('ide-menu-overlay-injector')

/**
 * Internal wrapper rendered into the overlay through a `ComponentPortal` (which,
 * unlike a `TemplatePortal`, needs no `ViewContainerRef`). It projects the
 * caller's template via `ngTemplateOutlet`, so the template keeps binding against
 * its own declaration component while `ngTemplateOutletInjector` layers in the
 * menu stack / trigger providers.
 */
@Component({
  selector: 'ide-menu-overlay-host',
  standalone: true,
  imports: [NgTemplateOutlet],
  template:
    '<ng-container [ngTemplateOutlet]="template" [ngTemplateOutletContext]="context" [ngTemplateOutletInjector]="menuInjector"></ng-container>',
  styles: [':host { display: contents; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class IdeMenuOverlayHostComponent {
  protected readonly template = inject(MENU_OVERLAY_TEMPLATE)
  protected readonly context = inject(MENU_OVERLAY_CONTEXT, { optional: true })
  protected readonly menuInjector = inject(MENU_OVERLAY_INJECTOR)
}

/**
 * Opens a menu at the pointer position, on top of `@angular/cdk`.
 *
 * Replacement for ng-zorro's `NzContextMenuService`: swap
 * `contextMenuService.create(event, dropdown)` for
 * `contextMenuService.open(event, menu)`, where `menu` is a `TemplateRef`
 * (an `<ng-template>` wrapping an `IdeMenuComponent`) instead of an
 * `<nz-dropdown-menu>`.
 *
 * The rendered menu is a real CDK popup menu: it registers on a private
 * {@link MenuStack}, so selecting an item, pressing Escape/Tab or clicking
 * outside all close it. Teardown is deferred to a microtask so an item's own
 * `(click)` runs to completion before its view is destroyed.
 *
 * @example
 * ```ts
 * this.explorerService.onDidContextMenu.subscribe((e) => {
 *   this.commands.next(this.explorerService.listCommands())
 *   this.contextMenuService.open(e.event, this.menu)
 * })
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  private readonly overlay = inject(Overlay)
  private readonly environmentInjector = inject(EnvironmentInjector)

  /** Disposes the currently open menu, if any. */
  private current: (() => void) | null = null

  /**
   * Opens `menu` at the position of `event`.
   * @param event Pointer event whose `clientX`/`clientY` anchor the menu.
   * @param menu The menu template to render.
   * @param config Optional behaviour overrides.
   * @returns The overlay hosting the menu (already attached).
   */
  open(event: MouseEvent, menu: IdeContextMenuContent, config: IdeContextMenuConfig = {}): OverlayRef {
    // Suppress the native menu and keep the opening event from reaching the
    // overlay's outside-click dispatcher (which would close us immediately).
    event.preventDefault()
    event.stopPropagation()
    this.close()

    // The opening gesture emits a trailing event (pointerup/auxclick/click, and
    // for a right click the very `contextmenu` that opened us) that lands just
    // after the overlay attaches and targets the same element. CDK's outside
    // dispatcher would read it as an outside click and close the menu at once,
    // so we ignore outside events aimed at the opener, like CdkMenuTrigger does.
    const openTarget = event.target as Node | null

    const templateRef = menu instanceof TemplateRef ? menu : menu.templateRef
    const autoFocus = config.autoFocus !== false
    const restoreFocus = autoFocus ? (document.activeElement as HTMLElement | null) : null

    // A private stack + a trigger stub make the rendered CdkMenu behave as a
    // popup menu (isInline === false): it pushes itself onto the stack, so item
    // activation / Escape / Tab / outside clicks all surface through the stack.
    let childMenu: CdkMenu | null = null
    const menuStack = runInInjectionContext(this.environmentInjector, () => new MenuStack())
    const trigger = {
      registerChildMenu: (child: CdkMenu) => (childMenu = child),
      getMenu: () => childMenu ?? undefined,
      isOpen: () => true,
      close: () => menuStack.closeAll(),
    }

    // Consulted before the template's declaration view, so MENU_STACK /
    // MENU_TRIGGER resolve to ours while app services still resolve normally.
    const menuInjector = Injector.create({
      parent: this.environmentInjector,
      providers: [
        { provide: MENU_STACK, useValue: menuStack },
        { provide: MENU_TRIGGER, useValue: trigger },
      ],
    })

    const hostInjector = Injector.create({
      parent: this.environmentInjector,
      providers: [
        { provide: MENU_OVERLAY_TEMPLATE, useValue: templateRef },
        { provide: MENU_OVERLAY_CONTEXT, useValue: config.context ?? null },
        { provide: MENU_OVERLAY_INJECTOR, useValue: menuInjector },
      ],
    })

    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo({ x: event.clientX, y: event.clientY })
        .withLockedPosition()
        .withGrowAfterOpen()
        .withPositions(config.positions ?? CONTEXT_MENU_POSITIONS),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      disposeOnNavigation: true,
    })

    const componentRef = overlayRef.attach(new ComponentPortal(IdeMenuOverlayHostComponent, null, hostInjector))
    // Render synchronously so the menu is measured (correct position, no flash)
    // and its key manager is ready before we move focus into it.
    componentRef.changeDetectorRef.detectChanges()
    overlayRef.updatePosition()

    const subscription = new Subscription()
    let disposed = false
    const dispose = () => {
      if (disposed) {
        return
      }
      disposed = true
      subscription.unsubscribe()
      overlayRef.dispose()
      if (this.current === dispose) {
        this.current = null
      }
      restoreFocus?.focus()
    }
    this.current = dispose

    // The stack empties on selection, Escape and Tab. Defer teardown so the
    // item's own (click)/(keydown) listeners finish before the view is gone.
    subscription.add(menuStack.emptied.subscribe(() => queueMicrotask(dispose)))
    subscription.add(
      overlayRef.outsidePointerEvents().subscribe((outsideEvent) => {
        const target = outsideEvent.target as Node | null
        if (openTarget && target && (openTarget === target || openTarget.contains(target))) {
          return
        }
        queueMicrotask(dispose)
      })
    )
    // Safety net for self-disposal (e.g. disposeOnNavigation) so bookkeeping is cleared.
    subscription.add(overlayRef.detachments().subscribe(() => queueMicrotask(dispose)))

    if (autoFocus) {
      const menu = childMenu as CdkMenu | null
      menu?.focusFirstItem('program')
    }

    return overlayRef
  }

  /** Closes the currently open menu, if any. */
  close(): void {
    this.current?.()
  }
}
