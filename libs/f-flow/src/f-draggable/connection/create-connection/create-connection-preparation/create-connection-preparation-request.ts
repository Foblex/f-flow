import { FEventTrigger } from '../../../../domain';
import { IPointerEvent } from '../../../infrastructure';

export class CreateConnectionPreparationRequest {
  static readonly fToken = Symbol('CreateConnectionPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
