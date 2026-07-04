import { InjectionToken, Type } from '@angular/core';

/**
 * A connection-creation gesture strategy. The default drag-to-connect works without any
 * strategy; `withConnectionFlow(...)` installs an alternative (the built-in
 * click-to-connect, or a custom implementation) that `fDraggable` activates on init.
 *
 * A strategy drives the shared {@link FCreateConnectionSession}, so the preview line,
 * snapping, connectable marking, validation, and the `fCreateConnection` emission are
 * identical across gestures.
 */
export interface IFConnectionFlow {
  /** Called once by `fDraggable` after view init; set up listeners here. */
  initialize(): void;

  /** Called when `fDraggable` is destroyed; tear listeners down and cancel the session. */
  destroy(): void;
}

/**
 * Token holding the connection-flow strategy TYPE installed by `withConnectionFlow(...)`.
 * `fDraggable` instantiates it against the `f-flow` element injector, so the strategy can
 * inject flow-scoped services (`FCreateConnectionSession`, `FMediator`,
 * `FComponentsStore`, …) that are not visible at the consumer's injector.
 */
export const F_CONNECTION_FLOW = new InjectionToken<Type<IFConnectionFlow>>('F_CONNECTION_FLOW');
