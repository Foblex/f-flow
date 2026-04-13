import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../../../f-storage';
import { IConnectionWorkerPayloadItem } from '../../models';
import { BuildConnectionWorkerPayloadItemRequest } from './build-connection-worker-payload-item-request';

@Injectable()
@FExecutionRegister(BuildConnectionWorkerPayloadItemRequest)
export class BuildConnectionWorkerPayloadItem
  implements IExecution<BuildConnectionWorkerPayloadItemRequest, IConnectionWorkerPayloadItem>
{
  private readonly _store = inject(FComponentsStore);

  public handle({
    connection,
    geometry,
    originalIndex,
  }: BuildConnectionWorkerPayloadItemRequest): IConnectionWorkerPayloadItem {
    const { source, target, sourceRect, targetRect } = geometry;

    return {
      originalIndex,
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
