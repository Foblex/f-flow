export class PreventDefaultIsExternalItemRequest {
  static readonly fToken = Symbol('PreventDefaultIsExternalItemRequest');

  constructor(public readonly event: Event) {}
}
