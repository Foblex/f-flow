import { IPointerEvent } from '../../infrastructure';

export class PinchToZoomFinalizeRequest {
  static readonly fToken = Symbol('PinchToZoomFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
