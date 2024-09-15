import { IPoint } from '@foblex/2d';
import { FConnectorBase } from '../../../../../f-connectors';

export class CreateConnectionDragHandlerRequest {

  constructor(
    public onPointerDownPosition: IPoint,
    public connector: FConnectorBase
  ) {
  }
}
