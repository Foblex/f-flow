import { IConnectionWorkerResponse } from '../../models';

export class HandleConnectionWorkerMessageRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('HandleConnectionWorkerMessageRequest');

  constructor(public message?: IConnectionWorkerResponse) {}
}
