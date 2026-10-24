import { IPointerEvent } from '../../infrastructure';

export class DragExternalItemFinalizeRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DragExternalItemFinalizeRequest');

  constructor(public readonly event: IPointerEvent) {}
}
