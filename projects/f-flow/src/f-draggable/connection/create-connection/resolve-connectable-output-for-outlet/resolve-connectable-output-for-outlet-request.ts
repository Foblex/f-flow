import { FNodeOutletBase } from '../../../../f-connectors';

export class ResolveConnectableOutputForOutletRequest {
  static readonly fToken = Symbol('ResolveConnectableOutputForOutletRequest');
  constructor(public readonly outlet: FNodeOutletBase) {}
}
