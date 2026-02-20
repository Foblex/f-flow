import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { QueryVisibleNodesRequest } from './query-visible-nodes-request';
import { FGeometryCache } from '../f-geometry-cache';

@Injectable()
@FExecutionRegister(QueryVisibleNodesRequest)
export class QueryVisibleNodesExecution
  implements IExecution<QueryVisibleNodesRequest, string[]>
{
  private readonly _cache = inject(FGeometryCache);

  public handle({ visibleWorldRect }: QueryVisibleNodesRequest): string[] {
    return this._cache.queryVisibleNodes(visibleWorldRect);
  }
}
