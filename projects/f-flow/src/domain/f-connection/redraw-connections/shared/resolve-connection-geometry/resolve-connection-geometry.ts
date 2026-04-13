import { IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { ResolveConnectionEndpointRectRequest } from '../resolve-connection-endpoint-rect';
import { ResolveConnectionEndpointsRequest } from '../resolve-connection-endpoints';
import { ResolveConnectionGeometryRequest } from './resolve-connection-geometry-request';
import { IConnectionEndpoints, IConnectionGeometry } from '../../models';
import { FConnectionBase } from '../../../../../f-connection-v2';
import { FConnectorBase } from '../../../../../f-connectors';

@Injectable()
@FExecutionRegister(ResolveConnectionGeometryRequest)
export class ResolveConnectionGeometry
  implements IExecution<ResolveConnectionGeometryRequest, IConnectionGeometry | null>
{
  private readonly _mediator = inject(FMediator);

  public handle({
    connection,
    cache,
  }: ResolveConnectionGeometryRequest): IConnectionGeometry | null {
    const endpoints = this._resolveConnectionEndpoints(connection);
    if (!endpoints) {
      return null;
    }

    return {
      ...endpoints,
      sourceRect: this._resolveEndpointRect(endpoints.source, cache),
      targetRect: this._resolveEndpointRect(endpoints.target, cache),
    };
  }

  private _resolveConnectionEndpoints(connection: FConnectionBase): IConnectionEndpoints | null {
    return this._mediator.execute<IConnectionEndpoints | null>(
      new ResolveConnectionEndpointsRequest(connection),
    );
  }

  private _resolveEndpointRect(
    connector: FConnectorBase,
    cache: Map<string, IRoundedRect>,
  ): IRoundedRect {
    return this._mediator.execute<IRoundedRect>(
      new ResolveConnectionEndpointRectRequest(connector, cache),
    );
  }
}
