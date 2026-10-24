import { FNodeBase } from '../../../f-node';
import type { DragNodeHandler } from '../drag-node-handler';

export class AttachDragNodeHandlerFromSelectionRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: DragNodeHandler;

  static readonly fToken = Symbol('AttachDragNodeHandlerFromSelectionRequest');
  constructor(public readonly nodeOrGroup?: FNodeBase) {}
}
