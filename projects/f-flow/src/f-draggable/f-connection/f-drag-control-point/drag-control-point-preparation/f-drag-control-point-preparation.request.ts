import { FEventTrigger } from '../../../../domain';
import { IPointerEvent } from '../../../../drag-toolkit';

export class FDragControlPointPreparationRequest {
  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger,
  ) {}
}
