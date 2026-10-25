import { FNodeBase } from '../../../f-node';
import type { IRect } from '../../../_libs/f-2d';

export class GetNormalizedParentNodeRectRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IRect;

  static readonly fToken = Symbol('GetNormalizedParentNodeRectRequest');

  constructor(public readonly nodeOrGroup: FNodeBase) {}
}
