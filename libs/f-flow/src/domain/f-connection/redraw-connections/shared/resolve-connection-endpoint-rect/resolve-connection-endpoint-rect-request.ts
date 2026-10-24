import { IRoundedRect } from '@foblex/2d';
import { FConnectorBase } from '../../../../../f-connectors';

export class ResolveConnectionEndpointRectRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IRoundedRect;

  static readonly fToken = Symbol('ResolveConnectionEndpointRectRequest');

  constructor(
    public connector: FConnectorBase,
    public cache: Map<string, IRoundedRect>,
  ) {}
}
