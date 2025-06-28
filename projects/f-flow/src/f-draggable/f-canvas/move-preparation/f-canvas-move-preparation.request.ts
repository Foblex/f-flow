import { FEventTrigger } from '../../../domain';
import {IPointerEvent} from "../../../drag-toolkit";

export class FCanvasMovePreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger
  ) {
  }
}
