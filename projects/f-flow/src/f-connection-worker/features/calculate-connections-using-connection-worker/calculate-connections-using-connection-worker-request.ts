import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../f-connection-v2';

export class CalculateConnectionsUsingConnectionWorkerRequest {
  static readonly fToken = Symbol('CalculateConnectionsUsingConnectionWorkerRequest');

  constructor(
    public readonly connections: readonly FConnectionBase[],
    public readonly cache: Map<string, IRoundedRect>,
  ) {}
}
