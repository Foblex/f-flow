import { IConnectionRedrawSession } from '../../models';

export class CompleteConnectionRedrawRequest {
  static readonly fToken = Symbol('CompleteConnectionRedrawRequest');

  constructor(public session: IConnectionRedrawSession) {}
}
