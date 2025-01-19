import { FNodeBase } from '../../../f-node';

export class IsArrayHasParentNodeRequest {

  constructor(
    public fParentNodes: FNodeBase[],
    public fDraggedNodes: FNodeBase[]
  ) {
  }
}
