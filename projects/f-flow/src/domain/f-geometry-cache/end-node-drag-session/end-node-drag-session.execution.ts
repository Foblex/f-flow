import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { EndNodeDragSessionRequest } from './end-node-drag-session-request';
import { FGeometryCache } from '../f-geometry-cache';

@Injectable()
@FExecutionRegister(EndNodeDragSessionRequest)
export class EndNodeDragSessionExecution
  implements IExecution<EndNodeDragSessionRequest, void>
{
  private readonly _cache = inject(FGeometryCache);

  public handle({ nodeId, commit }: EndNodeDragSessionRequest): void {
    this._cache.endDragSession(nodeId, commit);
  }
}
