import { ILine } from '../../../../../_libs/f-2d';
import { FConnectorBase } from '../../../../../f-connectors';
import { FConnectionBase } from '../../../../../f-connection-v2';

export class RenderConnectionWithLineRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('RenderConnectionWithLineRequest');

  constructor(
    public connection: FConnectionBase,
    public source: FConnectorBase,
    public target: FConnectorBase,
    public line: ILine,
  ) {}
}
