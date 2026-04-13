import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IConnectionWorkerResultItem } from '../../models';
import { RunConnectionWorkerRequest } from '../run-connection-worker';
import { RunConnectionWorkerBatchRequest } from './run-connection-worker-batch-request';

@Injectable()
@FExecutionRegister(RunConnectionWorkerBatchRequest)
export class RunConnectionWorkerBatch
  implements IExecution<RunConnectionWorkerBatchRequest, Promise<IConnectionWorkerResultItem[]>>
{
  private readonly _mediator = inject(FMediator);

  public handle({
    batch,
  }: RunConnectionWorkerBatchRequest): Promise<IConnectionWorkerResultItem[]> {
    if (!batch.payload.length) {
      return Promise.resolve([]);
    }

    return this._mediator.execute<Promise<IConnectionWorkerResultItem[]>>(
      new RunConnectionWorkerRequest(batch.payload),
    );
  }
}
