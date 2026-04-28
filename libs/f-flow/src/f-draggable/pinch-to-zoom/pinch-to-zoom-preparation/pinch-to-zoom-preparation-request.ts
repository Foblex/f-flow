import { IPointerEvent } from '../../infrastructure';

export class PinchToZoomPreparationRequest {
  static readonly fToken = Symbol('PinchToZoomPreparationRequest');
  constructor(public readonly event: IPointerEvent) {}
}
