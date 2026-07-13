export class StartConnectionRedrawRequest {
  static readonly fToken = Symbol('StartConnectionRedrawRequest');
  /**
   * Scoped passes keep the connected state of untouched connections intact,
   * so they must not reset the whole graph's connected connectors.
   */
  constructor(public readonly resetConnectedState: boolean = true) {}
}
