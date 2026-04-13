import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { ILine } from '@foblex/2d';
import { EFConnectableSide } from '../../../../../f-connection-v2';
import { RenderConnectionFromGeometryRequest } from '../../main-thread/render-connection-from-geometry';
import { RenderConnectionWithLineRequest } from '../../main-thread/render-connection-with-line';
import { IConnectionWorkerBatchItem, IConnectionWorkerResultItem } from '../../models';
import { ApplyConnectionWorkerResultRequest } from './apply-connection-worker-result-request';

@Injectable()
@FExecutionRegister(ApplyConnectionWorkerResultRequest)
export class ApplyConnectionWorkerResult
  implements IExecution<ApplyConnectionWorkerResultRequest, void>
{
  private readonly _mediator = inject(FMediator);

  public handle({ batchItem, result }: ApplyConnectionWorkerResultRequest): void {
    if (!batchItem) {
      return;
    }

    if (!this._isSupportedWorkerResult(result)) {
      this._fallbackToMainThread(batchItem);

      return;
    }

    try {
      batchItem.connection._applyResolvedSidesToConnection(
        result.sourceSide as EFConnectableSide,
        result.targetSide as EFConnectableSide,
      );
      this._mediator.execute<void>(
        new RenderConnectionWithLineRequest(
          batchItem.connection,
          batchItem.geometry.source,
          batchItem.geometry.target,
          result.line,
        ),
      );
    } catch {
      this._fallbackToMainThread(batchItem);
    }
  }

  private _fallbackToMainThread(batchItem: IConnectionWorkerBatchItem): void {
    this._mediator.execute<void>(
      new RenderConnectionFromGeometryRequest(batchItem.connection, batchItem.geometry),
    );
  }

  private _isSupportedWorkerResult(
    result: IConnectionWorkerResultItem | undefined,
  ): result is IConnectionWorkerResultItem & {
    sourceSide: string;
    targetSide: string;
    line: NonNullable<ILine>;
  } {
    return !!(result?.supported && result.sourceSide && result.targetSide && result.line);
  }
}
