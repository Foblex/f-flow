import { FNodeBase } from '../../../../../f-node';
import {IPointerEvent} from "../../../../../drag-toolkit";

export class FCreateConnectionFromOutputPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public fNode: FNodeBase
  ) {
  }
}
