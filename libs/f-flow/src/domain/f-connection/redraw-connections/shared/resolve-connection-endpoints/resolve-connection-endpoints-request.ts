import { FConnectionBase } from '../../../../../f-connection-v2';

export class ResolveConnectionEndpointsRequest {
  static readonly fToken = Symbol('ResolveConnectionEndpointsRequest');

  constructor(public connection: FConnectionBase) {}
}
