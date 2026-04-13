import { FConnectionBase } from '../../../../../f-connection-v2';
import { IConnectionGeometry } from '../../models';

export class RenderConnectionFromGeometryRequest {
  static readonly fToken = Symbol('RenderConnectionFromGeometryRequest');

  constructor(
    public connection: FConnectionBase,
    public geometry: IConnectionGeometry,
  ) {}
}
