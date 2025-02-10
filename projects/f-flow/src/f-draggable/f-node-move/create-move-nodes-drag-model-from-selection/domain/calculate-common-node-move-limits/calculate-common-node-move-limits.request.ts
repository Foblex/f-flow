import { INodeMoveLimitsAndPosition } from '../../i-node-move-limits-and-position';

export class CalculateCommonNodeMoveLimitsRequest {

  constructor(
    public limits: INodeMoveLimitsAndPosition[]
  ) {
  }
}
