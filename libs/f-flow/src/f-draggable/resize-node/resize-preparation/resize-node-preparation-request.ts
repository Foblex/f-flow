import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from '../../infrastructure';

export class ResizeNodePreparationRequest {
  static readonly fToken = Symbol('ResizeNodePreparationRequest');

  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
