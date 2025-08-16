import {INodeMoveLimitsAndPosition} from '../i-node-move-limits-and-position';

export class CalculateSummaryDragLimitsRequest {
  static readonly fToken = Symbol('CalculateSummaryDragLimitsRequest');

  constructor(
    public limits: INodeMoveLimitsAndPosition[]
  ) {
  }
}
