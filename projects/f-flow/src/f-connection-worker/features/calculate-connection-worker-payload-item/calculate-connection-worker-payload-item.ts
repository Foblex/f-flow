import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IFConnectionWorkerRequestItem } from '../../model';
import { CalculateConnectionWorkerPayloadItemRequest } from './calculate-connection-worker-payload-item-request';
import {
  IFConnectionWorkerContext,
  ResolveConnectionWorkerContextRequest,
} from '../resolve-connection-worker-context';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(CalculateConnectionWorkerPayloadItemRequest)
export class CalculateConnectionWorkerPayloadItem
  implements
    IExecution<CalculateConnectionWorkerPayloadItemRequest, IFConnectionWorkerRequestItem | null>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

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
      sourceRotation: this._store.nodes.get(source.fNodeId)?._rotate || 0,
      targetRotation: this._store.nodes.get(target.fNodeId)?._rotate || 0,
      sourceRect: {
        x: sourceRect.x,
        y: sourceRect.y,
        width: sourceRect.width,
        height: sourceRect.height,
        radius1: sourceRect.radius1,
        radius2: sourceRect.radius2,
        radius3: sourceRect.radius3,
        radius4: sourceRect.radius4,
      },
      targetRect: {
        x: targetRect.x,
        y: targetRect.y,
        width: targetRect.width,
        height: targetRect.height,
        radius1: targetRect.radius1,
        radius2: targetRect.radius2,
        radius3: targetRect.radius3,
        radius4: targetRect.radius4,
      },
    };
  }
}
