import { IPointerEvent } from '@foblex/drag-toolkit';

export class NodeResizeFinalizeRequest {

  constructor(
    public event: IPointerEvent
  ) {
  }
}
