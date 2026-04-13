import { IRoundedRect } from '@foblex/2d';
import { FConnectorBase } from '../../../../../f-connectors';

export class ResolveConnectionEndpointRectRequest {
  static readonly fToken = Symbol('ResolveConnectionEndpointRectRequest');

  constructor(
    public connector: FConnectorBase,
    public cache: Map<string, IRoundedRect>,
  ) {}
}
