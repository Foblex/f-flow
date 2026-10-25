export class PreventDefaultIsExternalItemRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('PreventDefaultIsExternalItemRequest');

  constructor(public readonly event: Event) {}
}
