import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { UnregisterFCacheNodeRequest } from './unregister-node-request';
import { FCache } from '../../../model';
import { UnregisterFCacheConnectorRequest } from '../../f-cache-connectors';
import { F_CACHE_OPTIONS } from '../../../config';

@Injectable()
@FExecutionRegister(UnregisterFCacheNodeRequest)
export class UnregisterFCacheNode implements IExecution<UnregisterFCacheNodeRequest, void> {
  private readonly _store = inject(FCache);
  private readonly _mediator = inject(FMediator);
  private readonly _options = inject(F_CACHE_OPTIONS);

  public handle({ id }: UnregisterFCacheNodeRequest): void {
    if (!this._options.enabled) {
      return;
    }

    const entry = this._store.nodeEntries.get(id);
    if (!entry) {
      return;
    }

    this._store.nodeEntries.delete(id);
    this._store.nodeIdByElement.delete(entry.element);

    const connectorKeys = Array.from(this._store.connectorKeysByNodeId.get(id) ?? []);

    for (const connectorKey of connectorKeys) {
      const connector = this._store.connectorEntries.get(connectorKey);
      if (!connector) {
        continue;
      }

      this._mediator.execute(new UnregisterFCacheConnectorRequest(connector.id, connector.kind));
    }

    this._store.connectorKeysByNodeId.delete(id);
  }
}
