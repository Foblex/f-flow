import { IPointerEvent } from '@foblex/drag-toolkit';
import { FNodeBase } from '../../../../../f-node';

export class CreateConnectionFromOutletPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fNode: FNodeBase
  ) {
  }
}
