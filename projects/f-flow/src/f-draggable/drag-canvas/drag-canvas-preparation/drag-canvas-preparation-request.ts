import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from '../../../drag-toolkit';

export class DragCanvasPreparationRequest {
  static readonly fToken = Symbol('DragCanvasPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
