import { FSelectionAreaBase } from '../../f-selection-area-base';
import { FEventTrigger } from '../../../domain';
import {IPointerEvent} from "../../../drag-toolkit";

export class SelectionAreaPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fSelectionArea: FSelectionAreaBase,
    public fTrigger: FEventTrigger
  ) {
  }
}
