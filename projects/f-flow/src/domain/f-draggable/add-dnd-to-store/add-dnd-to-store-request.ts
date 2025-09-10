import { FDraggableBase } from '../../../f-draggable';

export class AddDndToStoreRequest {
  static readonly fToken = Symbol('AddDndToStoreRequest');

  constructor(
    public fComponent: FDraggableBase,
  ) {
  }
}
