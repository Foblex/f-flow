import { IPointerEvent } from '../../infrastructure';

export class DragMinimapPreparationRequest {
  static readonly fToken = Symbol('DragMinimapPreparationRequest');

  constructor(public readonly event: IPointerEvent) {}
}
