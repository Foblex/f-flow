import { FConnectorBase } from '../../../f-connectors';

export class GetConnectorRectReferenceRequest {
  static readonly fToken = Symbol('GetConnectorRectReferenceRequest');
  constructor(public readonly connector: FConnectorBase) {}
}
