import { FConnectionBase } from '../../../../../f-connection-v2';
import type { IConnectionEndpoints } from '../../models';

export class ResolveConnectionEndpointsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IConnectionEndpoints | null;

  static readonly fToken = Symbol('ResolveConnectionEndpointsRequest');

  constructor(public connection: FConnectionBase) {}
}
