import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../f-connection-v2';

export class CalculateConnectionWorkerPayloadItemRequest {
  static readonly fToken = Symbol('CalculateConnectionWorkerPayloadItemRequest');

  constructor(
    public readonly connection: FConnectionBase,
    public readonly cache: Map<string, IRoundedRect>,
  ) {}
}
