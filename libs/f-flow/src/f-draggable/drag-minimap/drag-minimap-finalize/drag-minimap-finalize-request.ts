import { IPointerEvent } from '../../infrastructure';

export class DragMinimapFinalizeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DragMinimapFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
