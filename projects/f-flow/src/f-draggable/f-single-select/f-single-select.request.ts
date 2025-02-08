import { IPointerEvent } from '@foblex/drag-toolkit';
import { FEventTrigger } from '../../domain';

export class FSingleSelectRequest {

  constructor(
    public event: IPointerEvent,
    public fMultiSelectTrigger: FEventTrigger
  ) {
  }
}
