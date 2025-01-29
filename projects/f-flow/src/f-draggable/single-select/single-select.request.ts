import { IPointerEvent } from '@foblex/drag-toolkit';
import { FEventTrigger } from '../../domain';

export class SingleSelectRequest {

  constructor(
    public event: IPointerEvent,
    public fMultiSelectTrigger: FEventTrigger
  ) {
  }
}
