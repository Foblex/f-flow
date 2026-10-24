import { IPointerEvent } from '../../../f-draggable/infrastructure';

export class OnPointerMoveRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('OnPointerMoveRequest');

  constructor(public event: IPointerEvent) {}
}
