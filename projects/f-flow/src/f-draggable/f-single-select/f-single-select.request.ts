import { FEventTrigger } from '../../domain';
import {IPointerEvent} from "../../drag-toolkit";

export class FSingleSelectRequest {

  constructor(
    public event: IPointerEvent,
    public fMultiSelectTrigger: FEventTrigger
  ) {
  }
}
