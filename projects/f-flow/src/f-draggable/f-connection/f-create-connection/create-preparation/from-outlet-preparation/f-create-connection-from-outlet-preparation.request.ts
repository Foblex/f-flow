import { FNodeBase } from '../../../../../f-node';
import {IPointerEvent} from "../../../../../drag-toolkit";

export class FCreateConnectionFromOutletPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fNode: FNodeBase
  ) {
  }
}
