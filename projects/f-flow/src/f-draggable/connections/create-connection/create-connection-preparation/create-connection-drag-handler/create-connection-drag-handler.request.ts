import { IPoint } from '@foblex/core';
import { FConnectorBase } from '../../../../../f-connectors';

export class CreateConnectionDragHandlerRequest {

  constructor(
    public position: IPoint,
    public connector: FConnectorBase,
    public connectorCenter: IPoint
  ) {
  }
}
