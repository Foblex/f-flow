import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../f-connection-v2';
import { IFConnectionWorkerConnectors } from '../resolve-connection-worker-connectors';

export interface IFConnectionWorkerContext extends IFConnectionWorkerConnectors {
  sourceRect: IRoundedRect;
  targetRect: IRoundedRect;
}

export class ResolveConnectionWorkerContextRequest {
  static readonly fToken = Symbol('ResolveConnectionWorkerContextRequest');

  constructor(
    public readonly connection: FConnectionBase,
    public readonly cache: Map<string, IRoundedRect>,
  ) {}
}
