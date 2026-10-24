import { IPointerEvent } from '../../infrastructure';

export class PinchToZoomPreparationRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('PinchToZoomPreparationRequest');
  constructor(public readonly event: IPointerEvent) {}
}
