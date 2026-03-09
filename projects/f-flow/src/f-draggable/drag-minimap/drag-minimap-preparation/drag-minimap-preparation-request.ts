import { IPointerEvent } from '../../../drag-toolkit';

export class DragMinimapPreparationRequest {
  static readonly fToken = Symbol('DragMinimapPreparationRequest');

  constructor(public readonly event: IPointerEvent) {}
}
