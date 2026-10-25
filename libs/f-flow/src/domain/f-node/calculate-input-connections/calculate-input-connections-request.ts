import { FNodeBase } from '../../../f-node';
import type { FConnectionBase } from '../../../f-connection-v2';

export class CalculateInputConnectionsRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: FConnectionBase[];

  static readonly fToken = Symbol('CalculateInputConnectionsRequest');
  constructor(public readonly nodeOrGroup: FNodeBase) {}
}
