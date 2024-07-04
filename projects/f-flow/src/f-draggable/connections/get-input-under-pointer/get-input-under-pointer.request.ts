import { IPointerEvent } from '@foblex/core';
import { CreateConnectionDragHandler } from '../create-connection';
import { ReassignConnectionDragHandler } from '../reassign-connection';

export class GetInputUnderPointerRequest {

  constructor(
    public event: IPointerEvent,
    public dragHandler: CreateConnectionDragHandler | ReassignConnectionDragHandler
  ) {
  }
}
