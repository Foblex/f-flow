import { IPointerEvent } from '../../infrastructure';

export class DragMinimapPreparationRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DragMinimapPreparationRequest');

  constructor(public readonly event: IPointerEvent) {}
}
