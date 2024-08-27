import { InjectionToken, Injector } from '@angular/core'

export interface IContribution {
  /**
   * Unique identifier of the contribution.
   */
  readonly id: string

  /**
   * Activates the contribution.
   * @param injector An injector to use for injecting tokens.
   */
  activate?(injector: Injector): void | Promise<void>

  /**
   * Lifecyle hook called before deactivating the contribution.
   * Implements this method to clean up subscriptions.
   */
  deactivate?(): void | Promise<void>
}

export const CONTRIBUTION = new InjectionToken<IContribution[]>('CONTRIBUTION')
