import { IConnectionWorkerPayloadItem } from '../../models';

export class RunConnectionWorkerRequest {
  static readonly fToken = Symbol('RunConnectionWorkerRequest');

  constructor(public payload: IConnectionWorkerPayloadItem[]) {}
}
