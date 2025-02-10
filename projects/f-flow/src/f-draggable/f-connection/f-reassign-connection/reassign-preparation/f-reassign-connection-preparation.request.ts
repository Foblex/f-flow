import { IPointerEvent } from '@foblex/drag-toolkit';
import { FEventTrigger } from '../../../../domain';

export class FReassignConnectionPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger
  ) {
  }
}
