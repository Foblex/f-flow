import { FConnectionBase } from '../../../../../f-connection-v2';
import { IConnectionGeometry } from '../../models';
import type { IConnectionWorkerPayloadItem } from '../../models';

export class BuildConnectionWorkerPayloadItemRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IConnectionWorkerPayloadItem;

  static readonly fToken = Symbol('BuildConnectionWorkerPayloadItemRequest');

  constructor(
    public connection: FConnectionBase,
    public geometry: IConnectionGeometry,
    public originalIndex: number,
  ) {}
}
