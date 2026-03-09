import { IRoundedRect } from '@foblex/2d';
import { FConnectorBase } from '../../../f-connectors';

export class CalculateConnectionWorkerConnectorRectRequest {
  static readonly fToken = Symbol('GetFConnectionWorkerConnectorRectRequest');

  constructor(
    public readonly connector: FConnectorBase,
    public readonly cache: Map<string, IRoundedRect>,
  ) {}
}
