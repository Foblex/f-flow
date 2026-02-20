import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { InvalidateNodeGeometryRequest } from './invalidate-node-geometry-request';
import { FGeometryCache } from '../f-geometry-cache';

@Injectable()
@FExecutionRegister(InvalidateNodeGeometryRequest)
export class InvalidateNodeGeometryExecution
  implements IExecution<InvalidateNodeGeometryRequest, void>
{
  private readonly _cache = inject(FGeometryCache);

  public handle({ nodeId }: InvalidateNodeGeometryRequest): void {
    this._cache.invalidateNode(nodeId);
  }
}
