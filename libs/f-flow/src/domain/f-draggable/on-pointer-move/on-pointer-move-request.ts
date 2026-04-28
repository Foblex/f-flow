import { IPointerEvent } from '../../../f-draggable/infrastructure';

export class OnPointerMoveRequest {
  static readonly fToken = Symbol('OnPointerMoveRequest');

  constructor(public event: IPointerEvent) {}
}
