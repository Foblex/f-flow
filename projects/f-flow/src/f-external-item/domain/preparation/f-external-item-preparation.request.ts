import { FEventTrigger } from '../../../domain';
import {IPointerEvent} from "../../../drag-toolkit";

export class FExternalItemPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fTrigger: FEventTrigger
  ) {
  }
}
