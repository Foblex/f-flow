import { FNodeBase } from '../../../../../f-node';
import { IPointerEvent } from "../../../../../drag-toolkit";

export class FCreateConnectionFromOutputPreparationRequest {
  static readonly fToken = Symbol('FCreateConnectionFromOutputPreparationRequest');
  constructor(
    public event: IPointerEvent,
    public fNode: FNodeBase,
  ) {
  }
}
