import { IPointerEvent } from '@foblex/core';
import { FSelectionAreaBase } from '../../f-selection-area-base';

export class SelectionAreaPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fSelectionArea: FSelectionAreaBase
  ) {
  }
}
