import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IFConnectionWorkerRequestItem } from '../../model';
import { CalculateConnectionWorkerPayloadItemRequest } from './calculate-connection-worker-payload-item-request';
import {
  IFConnectionWorkerContext,
  ResolveConnectionWorkerContextRequest,
} from '../resolve-connection-worker-context';

@Injectable()
@FExecutionRegister(CalculateConnectionWorkerPayloadItemRequest)
export class CalculateConnectionWorkerPayloadItem implements IExecution<
  CalculateConnectionWorkerPayloadItemRequest,
  IFConnectionWorkerRequestItem | null
> {
  private readonly _mediator = inject(FMediator);

  public handle({
    connection,
    cache,
  }: CalculateConnectionWorkerPayloadItemRequest): IFConnectionWorkerRequestItem | null {
    const context = this._mediator.execute<IFConnectionWorkerContext | null>(
      new ResolveConnectionWorkerContextRequest(connection, cache),
    );
    if (!context) {
      return null;
    }

    const { source, target, sourceRect, targetRect } = context;

    return {
      behavior: connection.fBehavior,
      outputSide: connection.fOutputSide(),
      inputSide: connection.fInputSide(),
      sourceConnectableSide: source.fConnectableSide,
      targetConnectableSide: target.fConnectableSide,
      sourceRect: {
        x: sourceRect.x,
        y: sourceRect.y,
        width: sourceRect.width,
        height: sourceRect.height,
      },
      targetRect: {
        x: targetRect.x,
        y: targetRect.y,
        width: targetRect.width,
        height: targetRect.height,
      },
    };
  }
}
