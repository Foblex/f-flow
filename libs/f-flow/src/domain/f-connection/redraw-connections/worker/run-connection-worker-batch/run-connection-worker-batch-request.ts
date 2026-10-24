import { IConnectionWorkerBatch } from '../../models';
import type { IConnectionWorkerResultItem } from '../../models';

export class RunConnectionWorkerBatchRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: Promise<IConnectionWorkerResultItem[]>;

  static readonly fToken = Symbol('RunConnectionWorkerBatchRequest');

  constructor(public batch: IConnectionWorkerBatch) {}
}
