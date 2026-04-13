import { FConnectionBase } from '../../../../../f-connection-v2';
import { IConnectionGeometry } from '../../models';

export class BuildConnectionWorkerPayloadItemRequest {
  static readonly fToken = Symbol('BuildConnectionWorkerPayloadItemRequest');

  constructor(
    public connection: FConnectionBase,
    public geometry: IConnectionGeometry,
    public originalIndex: number,
  ) {}
}
