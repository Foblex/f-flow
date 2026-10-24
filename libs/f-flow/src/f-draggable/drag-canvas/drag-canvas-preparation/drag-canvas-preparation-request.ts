import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from '../../infrastructure';

export class DragCanvasPreparationRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DragCanvasPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
