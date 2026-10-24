import { FConnectionBase } from '../../../../../f-connection-v2';
import { IConnectionGeometry } from '../../models';

export class RenderConnectionFromGeometryRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RenderConnectionFromGeometryRequest');

  constructor(
    public connection: FConnectionBase,
    public geometry: IConnectionGeometry,
  ) {}
}
