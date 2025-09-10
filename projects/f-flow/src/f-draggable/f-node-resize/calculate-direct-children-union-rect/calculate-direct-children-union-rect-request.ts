import { FNodeBase } from '../../../f-node';

export class CalculateDirectChildrenUnionRectRequest {
  static readonly fToken = Symbol('CalculateDirectChildrenUnionRectRequest');

  constructor(
    public nodeOrGroup: FNodeBase,
    public paddings: [ number, number, number, number ],
  ) {
  }
}
