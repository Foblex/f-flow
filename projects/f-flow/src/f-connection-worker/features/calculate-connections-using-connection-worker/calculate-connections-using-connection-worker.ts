import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CalculateConnectionsUsingConnectionWorkerRequest } from './calculate-connections-using-connection-worker-request';
import { ConnectionWorkerRunRequest } from '../connection-worker-run';
import { IFConnectionWorkerRequestItem, IFConnectionWorkerResultItem } from '../../model';
import { CalculateConnectionWorkerPayloadItemRequest } from '../calculate-connection-worker-payload-item';
import { FConnectionBase } from '../../../f-connection-v2';
import { IRoundedRect } from '@foblex/2d';

@Injectable()
@FExecutionRegister(CalculateConnectionsUsingConnectionWorkerRequest)
export class CalculateConnectionsUsingConnectionWorker implements IExecution<
  CalculateConnectionsUsingConnectionWorkerRequest,
  Promise<readonly IFConnectionWorkerResultItem[] | null>
> {
  private readonly _mediator = inject(FMediator);

  public handle({
    connections,
    cache,
  }: CalculateConnectionsUsingConnectionWorkerRequest): Promise<
    readonly IFConnectionWorkerResultItem[] | null
  > {
    const payload = this._buildWorkerPayload(connections, cache);

    return this._mediator.execute<Promise<IFConnectionWorkerResultItem[]>>(
      new ConnectionWorkerRunRequest(payload),
    );
  }

  private _buildWorkerPayload(
    connections: readonly FConnectionBase[],
    cache: Map<string, IRoundedRect>,
  ): IFConnectionWorkerRequestItem[] {
    const payload: IFConnectionWorkerRequestItem[] = [];

    for (let index = 0; index < connections.length; index++) {
      const payloadItem = this._calculateWorkerPayloadItem(connections[index], cache);
      if (!payloadItem) {
        continue;
      }
      payload.push({
        ...payloadItem,
        originalIndex: index,
      });
    }

    return payload;
  }

  private _calculateWorkerPayloadItem(
    connection: FConnectionBase,
    cache: Map<string, IRoundedRect>,
  ): IFConnectionWorkerRequestItem | null {
    return this._mediator.execute(
      new CalculateConnectionWorkerPayloadItemRequest(connection, cache),
    );
  }
}
