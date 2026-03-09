import { IFConnectionWorkerRequestItem } from '../../model';

export class ConnectionWorkerRunRequest {
  static readonly fToken = Symbol('ConnectionWorkerRunRequest');

  constructor(public readonly payload: IFConnectionWorkerRequestItem[]) {}
}
