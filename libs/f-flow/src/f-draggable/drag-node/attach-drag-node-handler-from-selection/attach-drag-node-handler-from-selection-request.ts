import { FNodeBase } from '../../../f-node';

export class AttachDragNodeHandlerFromSelectionRequest {
  static readonly fToken = Symbol('AttachDragNodeHandlerFromSelectionRequest');
  constructor(public readonly nodeOrGroup?: FNodeBase) {}
}
