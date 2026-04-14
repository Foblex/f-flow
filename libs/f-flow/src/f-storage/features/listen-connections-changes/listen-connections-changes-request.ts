export class ListenConnectionsChangesRequest {
  static readonly fToken = Symbol('ListenConnectionsChangesRequest');

  constructor(public readonly notifyOnSubscribe: boolean = true) {}
}
