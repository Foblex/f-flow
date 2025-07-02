import { FNodeBase } from '../../../f-node';

export class CreateMoveNodesDragModelFromSelectionRequest {
  static readonly fToken = Symbol('CreateMoveNodesDragModelFromSelectionRequest');

  constructor(
    public nodeWithDisabledSelection?: FNodeBase
  ) {
  }
}
