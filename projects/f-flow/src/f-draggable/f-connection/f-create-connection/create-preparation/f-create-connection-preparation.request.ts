import { IPointerEvent } from '@foblex/drag-toolkit';
import { FEventTrigger } from '../../../../domain';

export class FCreateConnectionPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger
  ) {
  }
}
