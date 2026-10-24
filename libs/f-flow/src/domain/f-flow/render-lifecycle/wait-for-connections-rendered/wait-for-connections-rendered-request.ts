import { DestroyRef } from '@angular/core';

export class WaitForConnectionsRenderedRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('WaitForConnectionsRenderedRequest');

  constructor(
    public readonly targetConnectionsRevision: number,
    public readonly targetNodesRevision: number,
    public readonly callback: () => void,
    public readonly destroyRef: DestroyRef,
  ) {}
}
