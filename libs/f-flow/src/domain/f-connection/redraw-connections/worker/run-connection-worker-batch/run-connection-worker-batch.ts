import { inject, Injectable } from '@angular/core';
import { FMediator, IExecution } from '../../../../../_libs/f-mediator';
import { IConnectionWorkerResultItem } from '../../models';
import { RunConnectionWorkerRequest } from '../run-connection-worker';
import { RunConnectionWorkerBatchRequest } from './run-connection-worker-batch-request';

@Injectable()
export class RunConnectionWorkerBatch implements IExecution<
  RunConnectionWorkerBatchRequest,
  Promise<IConnectionWorkerResultItem[]>
> {
  private readonly _mediator = inject(FMediator);

  public handle({
    batch,
  }: RunConnectionWorkerBatchRequest): Promise<IConnectionWorkerResultItem[]> {
    if (!batch.payload.length) {
      return Promise.resolve([]);
    }

    return this._mediator.execute(new RunConnectionWorkerRequest(batch.payload));
  }
}
