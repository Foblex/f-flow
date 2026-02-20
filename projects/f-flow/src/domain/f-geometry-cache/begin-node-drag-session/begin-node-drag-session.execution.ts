import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { BeginNodeDragSessionRequest } from './begin-node-drag-session-request';
import { FGeometryCache } from '../f-geometry-cache';

@Injectable()
@FExecutionRegister(BeginNodeDragSessionRequest)
export class BeginNodeDragSessionExecution
  implements IExecution<BeginNodeDragSessionRequest, void>
{
  private readonly _cache = inject(FGeometryCache);

  public handle({ nodeId }: BeginNodeDragSessionRequest): void {
    this._cache.beginDragSession(nodeId);
  }
}
