import { DestroyRef } from '@angular/core';

export class WaitForConnectionsRenderedRequest {
  static readonly fToken = Symbol('WaitForConnectionsRenderedRequest');

  constructor(
    public readonly targetConnectionsRevision: number,
    public readonly targetNodesRevision: number,
    public readonly callback: () => void,
    public readonly destroyRef: DestroyRef,
  ) {}
}
