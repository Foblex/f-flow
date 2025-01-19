import { INodeWithDistanceRestrictions } from '../../i-node-with-distance-restrictions';

export class CalculateCommonNodeMoveRestrictionsRequest {

  constructor(
    public restrictions: INodeWithDistanceRestrictions[]
  ) {
  }
}
