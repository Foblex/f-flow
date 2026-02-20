import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { UpdateNodeDragDeltaRequest } from './update-node-drag-delta-request';
import { FGeometryCache } from '../f-geometry-cache';

@Injectable()
@FExecutionRegister(UpdateNodeDragDeltaRequest)
export class UpdateNodeDragDeltaExecution
  implements IExecution<UpdateNodeDragDeltaRequest, void>
{
  private readonly _cache = inject(FGeometryCache);

  public handle({ nodeId, delta }: UpdateNodeDragDeltaRequest): void {
    this._cache.updateDragDelta(nodeId, delta);
  }
}
