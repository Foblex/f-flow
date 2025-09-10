import { FNodeOutletBase } from '../../../../f-connectors';

export class GetFirstConnectableOutputRequest {
  static readonly fToken = Symbol('GetFirstConnectableOutputRequest');
  constructor(
    public fOutlet: FNodeOutletBase,
  ) {
  }
}
