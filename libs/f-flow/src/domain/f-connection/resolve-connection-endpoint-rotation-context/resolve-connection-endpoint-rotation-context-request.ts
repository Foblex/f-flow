import { FConnectorBase } from '../../../f-connectors';
import { IConnectionEndpointRotationContext } from '../../../f-connection-v2';

export class ResolveConnectionEndpointRotationContextRequest {
  static readonly fToken = Symbol('ResolveConnectionEndpointRotationContextRequest');

  constructor(public readonly connector?: FConnectorBase) {}
}

export type TResolveConnectionEndpointRotationContextResponse =
  | IConnectionEndpointRotationContext
  | undefined;
