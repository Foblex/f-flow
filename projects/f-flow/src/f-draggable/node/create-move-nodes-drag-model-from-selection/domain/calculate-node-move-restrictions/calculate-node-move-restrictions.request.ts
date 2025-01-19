import { FNodeBase } from '../../../../../f-node';

export class CalculateNodeMoveRestrictionsRequest {

  constructor(
    public fNode: FNodeBase,
    public hasParentNodeInSelected: boolean
  ) {
  }
}
