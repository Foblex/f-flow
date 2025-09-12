import { FNodeBase } from '../../../../../f-node';
import { IPointerEvent } from "../../../../../drag-toolkit";

export class FCreateConnectionFromOutletPreparationRequest {
  static readonly fToken = Symbol('FCreateConnectionFromOutletPreparationRequest');
  constructor(
    public event: IPointerEvent,
    public fNode: FNodeBase,
  ) {
  }
}
