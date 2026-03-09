import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { InvalidateFCacheNodeRequest } from './invalidate-node-request';
import { FCache } from '../../../model';
import { F_CACHE_OPTIONS } from '../../../config';

@Injectable()
@FExecutionRegister(InvalidateFCacheNodeRequest)
export class InvalidateFCacheNode implements IExecution<InvalidateFCacheNodeRequest, void> {
  private readonly _store = inject(FCache);
  private readonly _options = inject(F_CACHE_OPTIONS);

  public handle({ nodeId, reason: _reason }: InvalidateFCacheNodeRequest): void {
    if (!this._options.enabled) {
      return;
    }

    const node = this._store.nodeEntries.get(nodeId);
    if (!node) {
      return;
    }

    node.rect = undefined;

    const connectorKeys = this._store.connectorKeysByNodeId.get(nodeId);
    if (!connectorKeys?.size) {
      return;
    }

    for (const connectorKey of connectorKeys) {
      const connector = this._store.connectorEntries.get(connectorKey);
      if (connector) {
        connector.rect = undefined;
      }
    }
  }
}
