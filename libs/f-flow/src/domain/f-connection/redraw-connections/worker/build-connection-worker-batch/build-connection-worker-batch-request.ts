import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../../../f-connection-v2';
import type { IConnectionWorkerBatch } from '../../models';

export class BuildConnectionWorkerBatchRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IConnectionWorkerBatch;

  static readonly fToken = Symbol('BuildConnectionWorkerBatchRequest');

  constructor(
    public connections: FConnectionBase[],
    public cache: Map<string, IRoundedRect>,
  ) {}
}
