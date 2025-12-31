import { IPointerEvent } from '../../../drag-toolkit';

export class PinchToZoomPreparationRequest {
  static readonly fToken = Symbol('PinchToZoomPreparationRequest');

  constructor(public readonly event: IPointerEvent) {}
}
