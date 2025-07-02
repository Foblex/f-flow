import { FNodeBase } from '../../../../../f-node';

export class CalculateNodeMoveLimitsRequest {
  static readonly fToken = Symbol('CalculateNodeMoveLimitsRequest');

  constructor(
    public fNode: FNodeBase,
    public hasParentNodeInSelected: boolean
  ) {
  }
}
