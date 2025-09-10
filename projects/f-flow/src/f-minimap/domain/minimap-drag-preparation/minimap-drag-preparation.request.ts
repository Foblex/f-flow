import { FMinimapData } from '../f-minimap-data';
import { IPointerEvent } from "../../../drag-toolkit";

export class MinimapDragPreparationRequest {
  static readonly fToken = Symbol('MinimapDragPreparationRequest');

  constructor(
    public event: IPointerEvent,
    public minimap: FMinimapData,
  ) {
  }
}
