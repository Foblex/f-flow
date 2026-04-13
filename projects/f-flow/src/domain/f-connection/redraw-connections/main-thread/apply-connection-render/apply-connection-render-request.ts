import { ILine } from '@foblex/2d';
import { FConnectionBase } from '../../../../../f-connection-v2';

export class ApplyConnectionRenderRequest {
  static readonly fToken = Symbol('ApplyConnectionRenderRequest');

  constructor(
    public connection: FConnectionBase,
    public line: ILine,
  ) {}
}
