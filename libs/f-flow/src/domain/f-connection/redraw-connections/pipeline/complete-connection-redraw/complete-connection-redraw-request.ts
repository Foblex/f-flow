import { IConnectionRedrawSession } from '../../models';

export class CompleteConnectionRedrawRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('CompleteConnectionRedrawRequest');

  constructor(public session: IConnectionRedrawSession) {}
}
