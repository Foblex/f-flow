import { IPointerEvent } from '../../infrastructure';

export class PinchToZoomFinalizeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('PinchToZoomFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
