import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RegisterFCacheNodeRequest } from './register-node-request';
import { FCache, FCacheNode } from '../../../model';
import { F_CACHE_OPTIONS } from '../../../config';

@Injectable()
@FExecutionRegister(RegisterFCacheNodeRequest)
export class RegisterFCacheNode implements IExecution<RegisterFCacheNodeRequest, void> {
  private readonly _store = inject(FCache);
  private readonly _options = inject(F_CACHE_OPTIONS);

  public handle({ id, element, reference }: RegisterFCacheNodeRequest): void {
    if (!this._options.enabled) {
      return;
    }

    const next = new FCacheNode(id, element, reference);

    this._store.nodeEntries.set(id, next);
    this._store.nodeIdByElement.set(element, id);

    this._store.connectorKeysByNodeId.set(
      id,
      this._store.connectorKeysByNodeId.get(id) ?? new Set(),
    );
  }
}
