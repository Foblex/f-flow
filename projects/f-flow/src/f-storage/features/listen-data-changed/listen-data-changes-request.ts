export class ListenDataChangesRequest {
  static readonly fToken = Symbol('ListenDataChangesRequest');

  constructor(public readonly notifyOnSubscribe: boolean = true) {}
}
