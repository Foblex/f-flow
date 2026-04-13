import { IRoundedRect } from '@foblex/2d';
import { FConnectionBase } from '../../../../../f-connection-v2';
import { IConnectionRedrawSession } from '../../models';

export class StartConnectionWorkerRedrawRequest {
  static readonly fToken = Symbol('StartConnectionWorkerRedrawRequest');

  constructor(
    public connections: FConnectionBase[],
    public cache: Map<string, IRoundedRect>,
    public session: IConnectionRedrawSession,
  ) {}
}
