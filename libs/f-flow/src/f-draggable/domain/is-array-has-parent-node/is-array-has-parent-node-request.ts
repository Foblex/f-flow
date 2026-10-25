import { FNodeBase } from '../../../f-node';

export class IsArrayHasParentNodeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: boolean;

  static readonly fToken = Symbol('IsArrayHasParentNodeRequest');
  constructor(
    public fParentNodes: FNodeBase[],
    public fDraggedNodes: FNodeBase[],
  ) {}
}
