import type { IConnectionRedrawSession } from '../../models';
export class StartConnectionRedrawRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IConnectionRedrawSession;

  static readonly fToken = Symbol('StartConnectionRedrawRequest');
  /**
   * Scoped passes keep the connected state of untouched connections intact,
   * so they must not reset the whole graph's connected connectors.
   */
  constructor(public readonly resetConnectedState: boolean = true) {}
}
