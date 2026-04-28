import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from '../../infrastructure';

export class DragCanvasPreparationRequest {
  static readonly fToken = Symbol('DragCanvasPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
