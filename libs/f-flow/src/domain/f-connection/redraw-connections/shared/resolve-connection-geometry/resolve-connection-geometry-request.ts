import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../../../f-connection-v2';
import type { IConnectionGeometry } from '../../models';

export class ResolveConnectionGeometryRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IConnectionGeometry | null;

  static readonly fToken = Symbol('ResolveConnectionGeometryRequest');

  constructor(
    public connection: FConnectionBase,
    public cache: Map<string, IRoundedRect>,
  ) {}
}
