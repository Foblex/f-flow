import { IPointerEvent } from '../../infrastructure';

export class DragNodeFinalizeRequest {
  static readonly fToken = Symbol('DragNodeFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
