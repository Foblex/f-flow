import { IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetNormalizedConnectorRectRequest } from '../../../../get-normalized-connector-rect';
import { FConnectorBase } from '../../../../../f-connectors';
import { ResolveConnectionEndpointRectRequest } from './resolve-connection-endpoint-rect-request';

@Injectable()
@FExecutionRegister(ResolveConnectionEndpointRectRequest)
export class ResolveConnectionEndpointRect
  implements IExecution<ResolveConnectionEndpointRectRequest, IRoundedRect>
{
  private readonly _mediator = inject(FMediator);

  public handle({ connector, cache }: ResolveConnectionEndpointRectRequest): IRoundedRect {
    const cacheKey = this._buildCacheKey(connector);
    const rect = cache.get(cacheKey) ?? this._calculateRect(connector);
    cache.set(cacheKey, rect);

    return rect;
  }

  private _buildCacheKey(connector: FConnectorBase): string {
    return `${connector.kind}::${connector.fId()}`;
  }

  private _calculateRect(connector: FConnectorBase): IRoundedRect {
    return this._mediator.execute<IRoundedRect>(
      new GetNormalizedConnectorRectRequest(connector.hostElement),
    );
  }
}
