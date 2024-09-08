import { IPoint } from '@foblex/core';
import { FConnectorBase } from '../../../../../f-connectors';

export class CreateConnectionDragHandlerRequest {

  constructor(
    public onPointerDownPosition: IPoint,
    public connector: FConnectorBase
  ) {
  }
}
