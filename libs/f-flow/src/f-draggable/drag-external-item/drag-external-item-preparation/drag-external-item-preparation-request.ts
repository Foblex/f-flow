import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from '../../infrastructure';

export class DragExternalItemPreparationRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('DragExternalItemPreparationRequest');

  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
