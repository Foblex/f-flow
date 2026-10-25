import { IRoundedRect } from '../../../../../_libs/f-2d';
import { FConnectionBase } from '../../../../../f-connection-v2';
import {
  IConnectionRedrawSession,
  IConnectionWorkerBatchItem,
  IConnectionWorkerResultItem,
} from '../../models';

export class RunConnectionRedrawSliceRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

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
