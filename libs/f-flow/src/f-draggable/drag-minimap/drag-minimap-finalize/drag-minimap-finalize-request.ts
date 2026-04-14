import { IPointerEvent } from '../../../drag-toolkit';

export class DragMinimapFinalizeRequest {
  static readonly fToken = Symbol('DragMinimapFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
