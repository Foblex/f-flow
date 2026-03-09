import { IRoundedRect } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import {
  IFConnectionWorkerConnectors,
  ResolveConnectionWorkerConnectorsRequest,
} from '../resolve-connection-worker-connectors';
import { CalculateConnectionWorkerConnectorRectRequest } from '../calculate-connection-worker-connector-rect';
import { FConnectorBase } from '../../../f-connectors';
import {
  IFConnectionWorkerContext,
  ResolveConnectionWorkerContextRequest,
} from './resolve-connection-worker-context-request';

@Injectable()
@FExecutionRegister(ResolveConnectionWorkerContextRequest)
export class ResolveConnectionWorkerContext implements IExecution<
  ResolveConnectionWorkerContextRequest,
  IFConnectionWorkerContext | null
> {
  private readonly _mediator = inject(FMediator);

  public handle({
    connection,
    cache,
  }: ResolveConnectionWorkerContextRequest): IFConnectionWorkerContext | null {
    const connectors = this._mediator.execute<IFConnectionWorkerConnectors | null>(
      new ResolveConnectionWorkerConnectorsRequest(connection),
    );
    if (!connectors) {
      return null;
    }

    const sourceRect = this._calculateConnectorRect(connectors.source, cache);
    const targetRect = this._calculateConnectorRect(connectors.target, cache);

    return {
      ...connectors,
      sourceRect,
      targetRect,
    };
  }

  private _calculateConnectorRect(
    connector: FConnectorBase,
    cache: Map<string, IRoundedRect>,
  ): IRoundedRect {
    return this._mediator.execute<IRoundedRect>(
      new CalculateConnectionWorkerConnectorRectRequest(connector, cache),
    );
  }
}
