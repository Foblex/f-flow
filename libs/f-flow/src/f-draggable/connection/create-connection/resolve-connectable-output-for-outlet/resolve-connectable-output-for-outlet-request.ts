import { FConnectorBase } from '../../../../f-connectors';

export class ResolveConnectableOutputForOutletRequest {
  static readonly fToken = Symbol('ResolveConnectableOutputForOutletRequest');
  constructor(public readonly outlet: FConnectorBase) {}
}
