import { IConnectionWorkerResponse } from '../../models';

export class HandleConnectionWorkerMessageRequest {
  static readonly fToken = Symbol('HandleConnectionWorkerMessageRequest');

  constructor(public message?: IConnectionWorkerResponse) {}
}
