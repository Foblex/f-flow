import { FEventTrigger } from '../../../../domain';
import {IPointerEvent} from "../../../../drag-toolkit";

export class FReassignConnectionPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger
  ) {
  }
}
