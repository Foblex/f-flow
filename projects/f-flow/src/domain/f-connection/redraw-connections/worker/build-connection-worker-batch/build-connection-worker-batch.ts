import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../../../f-connection-v2';
import {
  IConnectionGeometry,
  IConnectionWorkerBatch,
  IConnectionWorkerBatchItem,
  IConnectionWorkerPayloadItem,
} from '../../models';
import { ResolveConnectionGeometryRequest } from '../../shared/resolve-connection-geometry';
import { BuildConnectionWorkerPayloadItemRequest } from '../build-connection-worker-payload-item';
import { BuildConnectionWorkerBatchRequest } from './build-connection-worker-batch-request';

@Injectable()
@FExecutionRegister(BuildConnectionWorkerBatchRequest)
export class BuildConnectionWorkerBatch
  implements IExecution<BuildConnectionWorkerBatchRequest, IConnectionWorkerBatch>
{
  private readonly _mediator = inject(FMediator);

  public handle({ connections, cache }: BuildConnectionWorkerBatchRequest): IConnectionWorkerBatch {
    const items: (IConnectionWorkerBatchItem | null)[] = new Array(connections.length);
    const payload: IConnectionWorkerPayloadItem[] = [];

    for (let index = 0; index < connections.length; index++) {
      const item = this._buildBatchItem(connections[index], cache, index);
      items[index] = item;

      if (!item) {
        continue;
      }

      payload.push(item.payload);
    }

    return { items, payload };
  }

  private _buildBatchItem(
    connection: FConnectionBase,
    cache: Map<string, IRoundedRect>,
    originalIndex: number,
  ): IConnectionWorkerBatchItem | null {
    const geometry = this._mediator.execute<IConnectionGeometry | null>(
      new ResolveConnectionGeometryRequest(connection, cache),
    );
    if (!geometry) {
      return null;
    }

    return {
      connection,
      geometry,
      payload: this._mediator.execute<IConnectionWorkerPayloadItem>(
        new BuildConnectionWorkerPayloadItemRequest(connection, geometry, originalIndex),
      ),
    };
  }
}
