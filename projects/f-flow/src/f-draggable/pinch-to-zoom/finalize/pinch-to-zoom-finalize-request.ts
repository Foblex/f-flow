import { IPointerEvent } from '../../../drag-toolkit';

export class PinchToZoomFinalizeRequest {
  static readonly fToken = Symbol('PinchToZoomFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
