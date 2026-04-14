import { IConnectionWorkerBatch } from '../../models';

export class RunConnectionWorkerBatchRequest {
  static readonly fToken = Symbol('RunConnectionWorkerBatchRequest');

  constructor(public batch: IConnectionWorkerBatch) {}
}
