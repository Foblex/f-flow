import { IPointerEvent } from '../../infrastructure';

export class DragMinimapFinalizeRequest {
  static readonly fToken = Symbol('DragMinimapFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
