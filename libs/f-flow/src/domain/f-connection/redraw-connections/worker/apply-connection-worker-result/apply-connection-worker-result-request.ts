import { IConnectionWorkerBatchItem, IConnectionWorkerResultItem } from '../../models';

export class ApplyConnectionWorkerResultRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('ApplyConnectionWorkerResultRequest');

  constructor(
    public batchItem: IConnectionWorkerBatchItem | null,
    public result?: IConnectionWorkerResultItem,
  ) {}
}
