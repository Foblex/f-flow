import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { UnregisterFCacheConnectorRequest } from './unregister-connector-request';
import { FCache, FCacheConnectorKeyFactory } from '../../../model';
import { InvalidateFCacheNodeRequest } from '../../f-cache-nodes';
import { F_CACHE_OPTIONS } from '../../../config';

@Injectable()
@FExecutionRegister(UnregisterFCacheConnectorRequest)
export class UnregisterFCacheConnector implements IExecution<
  UnregisterFCacheConnectorRequest,
  void
> {
  private readonly _store = inject(FCache);
  private readonly _mediator = inject(FMediator);
  private readonly _options = inject(F_CACHE_OPTIONS);

  public handle({ connectorId, kind }: UnregisterFCacheConnectorRequest): void {
    if (!this._options.enabled) {
      return;
    }

    const key = FCacheConnectorKeyFactory.build(connectorId, kind);

    const entry = this._store.connectorEntries.get(key);
    if (!entry) {
      return;
    }

    this._store.connectorEntries.delete(key);
    this._store.connectorKeyByElement.delete(entry.element);

    this._detachConnectorFromNode(key, entry.nodeId);

    if (this._store.nodeEntries.has(entry.nodeId)) {
      this._mediator.execute(
        new InvalidateFCacheNodeRequest(entry.nodeId, 'connector-unregistered'),
      );
    }
  }

  private _detachConnectorFromNode(connectorKey: string, nodeId: string): void {
    const connectorKeys = this._store.connectorKeysByNodeId.get(nodeId);
    if (!connectorKeys) {
      return;
    }

    connectorKeys.delete(connectorKey);
    if (!connectorKeys.size) {
      this._store.connectorKeysByNodeId.delete(nodeId);
    }
  }
}
