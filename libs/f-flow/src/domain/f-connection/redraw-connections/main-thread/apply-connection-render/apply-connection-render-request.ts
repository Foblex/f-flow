import { ILine } from '../../../../../_libs/f-2d';
import { FConnectionBase } from '../../../../../f-connection-v2';

export class ApplyConnectionRenderRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('ApplyConnectionRenderRequest');

  constructor(
    public connection: FConnectionBase,
    public line: ILine,
  ) {}
}
