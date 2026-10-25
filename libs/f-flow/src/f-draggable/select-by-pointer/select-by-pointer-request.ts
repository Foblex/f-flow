import { FEventTrigger } from '../../domain';
import { IPointerEvent } from '../infrastructure';

export class SelectByPointerRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('SelectByPointerRequest');

  constructor(
    public readonly event: IPointerEvent,
    public readonly trigger: FEventTrigger,
  ) {}
}
