import { FNodeBase } from '../../../f-node';

export class CreateDragModelFromSelectionRequest {
  static readonly fToken = Symbol('CreateDragModelFromSelectionRequest');

  constructor(
    public nodeWithDisabledSelection?: FNodeBase,
  ) {
  }
}
