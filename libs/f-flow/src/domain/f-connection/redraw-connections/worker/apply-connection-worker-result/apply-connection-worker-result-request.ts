import { IConnectionWorkerBatchItem, IConnectionWorkerResultItem } from '../../models';

export class ApplyConnectionWorkerResultRequest {
  static readonly fToken = Symbol('ApplyConnectionWorkerResultRequest');

  constructor(
    public batchItem: IConnectionWorkerBatchItem | null,
    public result?: IConnectionWorkerResultItem,
  ) {}
}
