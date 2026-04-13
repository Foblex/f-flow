import { IConnectionRedrawSession } from '../../models';

export class IsConnectionRedrawCurrentRequest {
  static readonly fToken = Symbol('IsConnectionRedrawCurrentRequest');

  constructor(public session: IConnectionRedrawSession) {}
}
