import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RegisterConnectorGeometryRequest } from './register-connector-geometry-request';
import { FGeometryCache } from '../f-geometry-cache';

@Injectable()
@FExecutionRegister(RegisterConnectorGeometryRequest)
export class RegisterConnectorGeometryExecution
  implements IExecution<RegisterConnectorGeometryRequest, void>
{
  private readonly _cache = inject(FGeometryCache);

  public handle({ connectorId, nodeId, elementRef }: RegisterConnectorGeometryRequest): void {
    this._cache.registerConnector(connectorId, nodeId, elementRef);
  }
}
