import { FConnectionBase } from '../../../../../f-connection-v2';
import { IConnectionGeometry } from '../../models';

export class BuildConnectionLineRequest {
  static readonly fToken = Symbol('BuildConnectionLineRequest');

  constructor(
    public connection: FConnectionBase,
    public geometry: IConnectionGeometry,
  ) {}
}
