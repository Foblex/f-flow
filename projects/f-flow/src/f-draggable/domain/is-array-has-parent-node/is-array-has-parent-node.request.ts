import { FNodeBase } from '../../../f-node';

export class IsArrayHasParentNodeRequest {

  constructor(
    public fNode: FNodeBase,
    public fNodes: FNodeBase[]
  ) {
  }
}
