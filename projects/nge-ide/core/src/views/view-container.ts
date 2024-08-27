import { Icon } from '@cisstech/nge/ui/icon'
import { Observable, of } from 'rxjs'

/**
 * Lists of view container locations.
 */
export enum ViewContainerScopes {
  sidebar = 'sidebar',
  infobar = 'infobar',
}

/**
 * Representation of view container inside the infobar area.
 */
export interface IViewContainer {
  /** Unique identifier of the container */
  readonly id: string

  /** Title of the container. */
  readonly title: string

  /** Location of the container */
  readonly scope: ViewContainerScopes

  /** Optional badge to show with the title. */
  readonly badge: Observable<number>

  /**
   * Optional order of the container.
   * @remarks
   * - The order is used to sort the containers inside the sidebar.
   * - The higher the order, the more the container will be on the bottom.
   * @default 0
   */
  readonly order?: number
}

/**
 * Representation of view container inside the infobar area.
 */
export abstract class InfobarContainer implements IViewContainer {
  abstract readonly id: string
  abstract readonly title: string

  readonly scope = ViewContainerScopes.infobar
  readonly badge = of(0)
}

/**
 * Representation of view container inside the sidebar area.
 */
export abstract class SidebarContainer implements IViewContainer {
  abstract readonly id: string
  abstract readonly title: string

  readonly scope = ViewContainerScopes.sidebar

  /** Value of the badge associated to the view. */
  readonly badge = of(0)

  /** Icon of the container */
  abstract readonly icon: Icon

  /** Horizontal position of the container */
  abstract readonly side: 'left' | 'right'

  /** Vertical position of the view */
  abstract readonly align: 'top' | 'bottom'

  /** An action to call for non visual container. */
  onClickHandler?(): any | Promise<any>

  /**
   * A dropdown menu to show when the container is clicked.
   */
  dropdown?: {
    label: string
    action: () => void | Promise<void>
  }[]
}
