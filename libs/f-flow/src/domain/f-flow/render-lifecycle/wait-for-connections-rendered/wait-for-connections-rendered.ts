import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../../_libs/f-mediator';
import { WaitForConnectionsRenderedRequest } from './wait-for-connections-rendered-request';
import { FComponentsStore } from '../../../../f-storage';

@Injectable()
export class WaitForConnectionsRendered implements IExecution<
  WaitForConnectionsRenderedRequest,
  void
> {
  private readonly _store = inject(FComponentsStore);

  public handle({
    targetConnectionsRevision,
    targetNodesRevision,
    callback,
    destroyRef,
  }: WaitForConnectionsRenderedRequest): void {
    if (
      this._store.connectionsRenderedRevision >= targetConnectionsRevision &&
      this._store.connectionsRenderedNodesRevision >= targetNodesRevision
    ) {
      callback();

      return;
    }

    const stop = this._store.connectionsRenderedChanges$.listen(() => {
      if (
        this._store.connectionsRenderedRevision < targetConnectionsRevision ||
        this._store.connectionsRenderedNodesRevision < targetNodesRevision
      ) {
        return;
      }

      stop();
      callback();
    });

    destroyRef.onDestroy(stop);
  }
}
