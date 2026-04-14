import { ILine } from '@foblex/2d';
import { FConnectorBase } from '../../../../../f-connectors';
import { FConnectionBase } from '../../../../../f-connection-v2';

export class RenderConnectionWithLineRequest {
  static readonly fToken = Symbol('RenderConnectionWithLineRequest');

  constructor(
    public connection: FConnectionBase,
    public source: FConnectorBase,
    public target: FConnectorBase,
    public line: ILine,
  ) {}
}
