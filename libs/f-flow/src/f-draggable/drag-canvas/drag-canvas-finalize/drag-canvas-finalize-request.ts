import { IPointerEvent } from '../../infrastructure';

export class DragCanvasFinalizeRequest {
  static readonly fToken = Symbol('DragCanvasFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
