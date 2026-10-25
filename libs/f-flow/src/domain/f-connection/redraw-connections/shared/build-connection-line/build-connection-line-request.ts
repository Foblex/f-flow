import { FConnectionBase } from '../../../../../f-connection-v2';
import { IConnectionGeometry } from '../../models';
import type { ILine } from '../../../../../_libs/f-2d';

export class BuildConnectionLineRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: ILine;

  static readonly fToken = Symbol('BuildConnectionLineRequest');

  constructor(
    public connection: FConnectionBase,
    public geometry: IConnectionGeometry,
  ) {}
}
