import { IPointerEvent } from '../../../drag-toolkit';

export class DragNodeFinalizeRequest {
  static readonly fToken = Symbol('DragNodeFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
