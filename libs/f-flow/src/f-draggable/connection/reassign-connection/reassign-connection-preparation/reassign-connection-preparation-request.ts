import { FEventTrigger } from '../../../../domain';
import { IPointerEvent } from '../../../infrastructure';

export class ReassignConnectionPreparationRequest {
  static readonly fToken = Symbol('ReassignConnectionPreparationRequest');
  constructor(
    public readonly event: IPointerEvent,
    public readonly fTrigger: FEventTrigger,
  ) {}
}
