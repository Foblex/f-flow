import { IPointerEvent } from '@foblex/drag-toolkit';
import { FMinimapData } from '../f-minimap-data';

export class MinimapDragPreparationRequest {

  constructor(
    public event: IPointerEvent,
    public minimap: FMinimapData
  ) {
  }
}
