import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { SetModelNodeRectRequest } from './set-model-node-rect-request';
import { FGeometryCache } from '../f-geometry-cache';

@Injectable()
@FExecutionRegister(SetModelNodeRectRequest)
export class SetModelNodeRectExecution
  implements IExecution<SetModelNodeRectRequest, void>
{
  private readonly _cache = inject(FGeometryCache);

  public handle({ nodeId, worldRect }: SetModelNodeRectRequest): void {
    this._cache.setModelNodeRect(nodeId, worldRect);
  }
}
