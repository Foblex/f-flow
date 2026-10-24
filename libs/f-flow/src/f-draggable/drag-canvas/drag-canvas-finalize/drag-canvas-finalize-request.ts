import { IPointerEvent } from '../../infrastructure';

export class DragCanvasFinalizeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DragCanvasFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
