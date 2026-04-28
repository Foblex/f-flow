import { FEventTrigger } from '../../../domain';
import { IPointerEvent } from '../../infrastructure';

export class RotateNodePreparationRequest {
  static readonly fToken = Symbol('RotateNodePreparationRequest');

  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
