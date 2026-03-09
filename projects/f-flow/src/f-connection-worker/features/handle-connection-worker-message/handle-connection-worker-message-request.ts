import { IFConnectionWorkerResponse } from '../../model';

export class HandleConnectionWorkerMessageRequest {
  static readonly fToken = Symbol('HandleConnectionWorkerMessageRequest');

  constructor(public readonly message?: IFConnectionWorkerResponse) {}
}
