import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IRoundedRect } from '@foblex/2d';
import { GetConnectorGeometryRequest } from './get-connector-geometry-request';
import { FGeometryCache } from '../f-geometry-cache';

@Injectable()
@FExecutionRegister(GetConnectorGeometryRequest)
export class GetConnectorGeometryExecution
  implements IExecution<GetConnectorGeometryRequest, IRoundedRect | undefined>
{
  private readonly _cache = inject(FGeometryCache);

  public handle({ connectorId }: GetConnectorGeometryRequest): IRoundedRect | undefined {
    return this._cache.getConnectorRect(connectorId);
  }
}
