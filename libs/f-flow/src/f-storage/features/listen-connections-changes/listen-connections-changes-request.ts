import type { FChannelHub } from '../../../reactivity';
export class ListenConnectionsChangesRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: FChannelHub;

  static readonly fToken = Symbol('ListenConnectionsChangesRequest');

  constructor(public readonly notifyOnSubscribe: boolean = true) {}
}
