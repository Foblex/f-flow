import { DragNodeHandler } from '../drag-node-handler';

export class CreateSnapLinesRequest {
  static readonly fToken = Symbol('CreateSnapLinesRequest');

  constructor(public readonly summaryHandler: DragNodeHandler) {}
}
