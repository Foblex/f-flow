import { IPointerEvent } from '@foblex/core';
import { FMinimapData } from '../f-minimap-data';

export class MinimapDragPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public minimap: FMinimapData
  ) {
  }
}
