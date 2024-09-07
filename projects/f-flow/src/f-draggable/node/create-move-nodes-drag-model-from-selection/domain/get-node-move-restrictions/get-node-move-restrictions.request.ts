import { FNodeBase } from '../../../../../f-node';

export class GetNodeMoveRestrictionsRequest {

  constructor(
    public fNode: FNodeBase,
    public hasParentNodeInSelected: boolean
  ) {
  }
}
