import { IPointerEvent } from '@foblex/drag-toolkit';
import { FEventTrigger } from '../../../domain';

export class NodeResizePreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger
  ) {
  }
}
