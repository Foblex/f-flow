import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RegisterNodeGeometryRequest } from './register-node-geometry-request';
import { FGeometryCache } from '../f-geometry-cache';

@Injectable()
@FExecutionRegister(RegisterNodeGeometryRequest)
export class RegisterNodeGeometryExecution
  implements IExecution<RegisterNodeGeometryRequest, void>
{
  private readonly _cache = inject(FGeometryCache);

  public handle({ nodeId, elementRef }: RegisterNodeGeometryRequest): void {
    this._cache.registerNode(nodeId, elementRef);
  }
}
