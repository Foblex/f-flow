import { FConnectorBase } from '../../../f-connectors';
import { IConnectionEndpointRotationContext } from '../../../f-connection-v2';

export class ResolveConnectionEndpointRotationContextRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: TResolveConnectionEndpointRotationContextResponse;

  static readonly fToken = Symbol('ResolveConnectionEndpointRotationContextRequest');

  constructor(public readonly connector?: FConnectorBase) {}
}

export type TResolveConnectionEndpointRotationContextResponse =
  | IConnectionEndpointRotationContext
  | undefined;
