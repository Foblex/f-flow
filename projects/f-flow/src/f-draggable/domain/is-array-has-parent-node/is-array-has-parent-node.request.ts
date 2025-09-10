import { FNodeBase } from '../../../f-node';

export class IsArrayHasParentNodeRequest {
  static readonly fToken = Symbol('IsArrayHasParentNodeRequest');
  constructor(
    public fParentNodes: FNodeBase[],
    public fDraggedNodes: FNodeBase[],
  ) {
  }
}
