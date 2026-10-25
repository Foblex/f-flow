import { IConnectionWorkerPayloadItem } from '../../models';
import type { IConnectionWorkerResultItem } from '../../models';

export class RunConnectionWorkerRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: Promise<IConnectionWorkerResultItem[]>;

  static readonly fToken = Symbol('RunConnectionWorkerRequest');

  constructor(public payload: IConnectionWorkerPayloadItem[]) {}
}
