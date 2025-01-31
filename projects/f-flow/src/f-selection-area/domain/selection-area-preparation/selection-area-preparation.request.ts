import { IPointerEvent } from '@foblex/drag-toolkit';
import { FSelectionAreaBase } from '../../f-selection-area-base';
import { FEventTrigger } from '../../../domain';

export class SelectionAreaPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fSelectionArea: FSelectionAreaBase,
    public fTrigger: FEventTrigger
  ) {
  }
}
