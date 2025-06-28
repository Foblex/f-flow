import { FEventTrigger } from '../../../domain';
import {IPointerEvent} from "../../../drag-toolkit";

export class FNodeResizePreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger
  ) {
  }
}
