import { INodeMoveLimitsAndPosition } from '../../i-node-move-limits-and-position';

export class CalculateCommonNodeMoveLimitsRequest {
  static readonly fToken = Symbol('CalculateCommonNodeMoveLimitsRequest');
  constructor(
    public limits: INodeMoveLimitsAndPosition[]
  ) {
  }
}
