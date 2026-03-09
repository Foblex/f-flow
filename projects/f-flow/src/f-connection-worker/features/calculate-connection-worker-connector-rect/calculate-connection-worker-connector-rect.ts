import { IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { GetNormalizedConnectorRectRequest } from '../../../domain';
import { CalculateConnectionWorkerConnectorRectRequest } from './calculate-connection-worker-connector-rect-request';
import { FConnectorBase } from '../../../f-connectors';

@Injectable()
@FExecutionRegister(CalculateConnectionWorkerConnectorRectRequest)
export class CalculateConnectionWorkerConnectorRect implements IExecution<
  CalculateConnectionWorkerConnectorRectRequest,
  IRoundedRect
> {
  private readonly _mediator = inject(FMediator);

  public handle({ connector, cache }: CalculateConnectionWorkerConnectorRectRequest): IRoundedRect {
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
