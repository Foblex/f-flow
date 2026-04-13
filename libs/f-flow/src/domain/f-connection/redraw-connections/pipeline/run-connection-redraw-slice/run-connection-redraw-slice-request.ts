import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../../../f-connection-v2';
import {
  IConnectionRedrawSession,
  IConnectionWorkerBatchItem,
  IConnectionWorkerResultItem,
} from '../../models';

export class RunConnectionRedrawSliceRequest {
  static readonly fToken = Symbol('RunConnectionRedrawSliceRequest');

  constructor(
    public connections: FConnectionBase[],
    public cache: Map<string, IRoundedRect>,
    public startIndex: number,
    public session: IConnectionRedrawSession,
    public batchItems?: (IConnectionWorkerBatchItem | null)[],
    public workerResults?: (IConnectionWorkerResultItem | undefined)[],
  ) {}
}
