import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../../../f-connection-v2';

export class BuildConnectionWorkerBatchRequest {
  static readonly fToken = Symbol('BuildConnectionWorkerBatchRequest');

  constructor(
    public connections: FConnectionBase[],
    public cache: Map<string, IRoundedRect>,
  ) {}
}
