import { FNodeBase } from '../../../f-node';
import type { IRect } from '../../../_libs/f-2d';

export class CalculateDirectChildrenUnionRectRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IRect | null;

  static readonly fToken = Symbol('CalculateDirectChildrenUnionRectRequest');

  constructor(
    public nodeOrGroup: FNodeBase,
    public paddings: [number, number, number, number],
  ) {}
}
