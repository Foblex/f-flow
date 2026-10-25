import { FDraggableBase } from '../../../f-draggable';

export class AddDndToStoreRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('AddDndToStoreRequest');

  constructor(public fComponent: FDraggableBase) {}
}
