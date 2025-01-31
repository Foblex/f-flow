import { IPointerEvent } from '@foblex/drag-toolkit';
import { FEventTrigger } from '../../../../domain';

export class CreateConnectionPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger
  ) {
  }
}
