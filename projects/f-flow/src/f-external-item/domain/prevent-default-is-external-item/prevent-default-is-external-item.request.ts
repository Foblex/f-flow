export class PreventDefaultIsExternalItemRequest {
  static readonly fToken = Symbol('PreventDefaultIsExternalItemRequest');

  constructor(
    public event: Event,
  ) {
  }
}
