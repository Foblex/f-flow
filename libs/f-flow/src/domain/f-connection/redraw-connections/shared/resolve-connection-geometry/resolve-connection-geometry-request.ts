import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../../../f-connection-v2';

export class ResolveConnectionGeometryRequest {
  static readonly fToken = Symbol('ResolveConnectionGeometryRequest');

  constructor(
    public connection: FConnectionBase,
    public cache: Map<string, IRoundedRect>,
  ) {}
}
