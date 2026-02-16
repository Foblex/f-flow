import { IPointerEvent } from '../../../drag-toolkit';

export class DragCanvasFinalizeRequest {
  static readonly fToken = Symbol('DragCanvasFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
