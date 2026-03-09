import { inject, Injectable } from '@angular/core';
import { IRect } from '@foblex/2d';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { GetCachedFCacheRectRequest } from './get-cached-rect-request';
import { FCache } from '../../../model';
import { F_CACHE_OPTIONS } from '../../../config';

@Injectable()
@FExecutionRegister(GetCachedFCacheRectRequest)
export class GetCachedFCacheRect implements IExecution<
  GetCachedFCacheRectRequest,
  IRect | undefined
> {
  private readonly _store = inject(FCache);
  private readonly _options = inject(F_CACHE_OPTIONS);

  public handle({ element }: GetCachedFCacheRectRequest): IRect | undefined {
    if (!this._options.enabled) {
      return undefined;
    }

    const nodeId = this._store.nodeIdByElement.get(element);
    if (nodeId) {
      const nodeRect = this._store.nodeEntries.get(nodeId)?.rect;
      if (nodeRect) {
        return nodeRect;
      }
    }

    const key = this._store.connectorKeyByElement.get(element);
    if (!key) {
      return undefined;
    }

    return this._store.connectorEntries.get(key)?.rect ?? undefined;
  }
}
