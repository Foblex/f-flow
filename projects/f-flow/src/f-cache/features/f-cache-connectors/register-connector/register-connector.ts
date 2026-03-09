import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { RegisterFCacheConnectorRequest } from './register-connector-request';
import { FCache, FCacheConnector, FCacheConnectorKeyFactory } from '../../../model';
import { InvalidateFCacheNodeRequest } from '../../f-cache-nodes';
import { F_CACHE_OPTIONS } from '../../../config';

@Injectable()
@FExecutionRegister(RegisterFCacheConnectorRequest)
export class RegisterFCacheConnector implements IExecution<RegisterFCacheConnectorRequest, void> {
  private readonly _store = inject(FCache);
  private readonly _mediator = inject(FMediator);
  private readonly _options = inject(F_CACHE_OPTIONS);

  public handle({ id, nodeId, kind, element }: RegisterFCacheConnectorRequest): void {
    if (!this._options.enabled) {
      return;
    }

    const key = FCacheConnectorKeyFactory.build(id, kind);

    const previous = this._store.connectorEntries.get(key);
    if (previous) {
      this._detachConnectorFromNode(previous.key, previous.nodeId);
      this._store.connectorKeyByElement.delete(previous.element);
    }

    const next = new FCacheConnector(key, id, kind, nodeId, element);

    this._store.connectorEntries.set(key, next);
    this._store.connectorKeyByElement.set(element, key);

    const connectorKeys = this._store.connectorKeysByNodeId.get(nodeId) ?? new Set();
    connectorKeys.add(key);
    this._store.connectorKeysByNodeId.set(nodeId, connectorKeys);

    this._mediator.execute(new InvalidateFCacheNodeRequest(nodeId, 'connector-registered'));
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
