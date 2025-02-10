import { FNodeBase } from '../../../f-node';

export class CreateMoveNodesDragModelFromSelectionRequest {

  constructor(
    public nodeWithDisabledSelection?: FNodeBase
  ) {
  }
}
