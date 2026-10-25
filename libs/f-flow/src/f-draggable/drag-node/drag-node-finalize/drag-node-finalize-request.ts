import { IPointerEvent } from '../../infrastructure';

export class DragNodeFinalizeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DragNodeFinalizeRequest');
  constructor(public readonly event: IPointerEvent) {}
}
