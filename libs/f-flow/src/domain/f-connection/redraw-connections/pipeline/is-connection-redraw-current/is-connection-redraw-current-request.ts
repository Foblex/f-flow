import { IConnectionRedrawSession } from '../../models';

export class IsConnectionRedrawCurrentRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: boolean;

  static readonly fToken = Symbol('IsConnectionRedrawCurrentRequest');

  constructor(public session: IConnectionRedrawSession) {}
}
