import { EFConnectionBehavior } from '../../f-connection';
import { EFConnectableSide } from '../../f-connectors';
import { IConnectorShape } from '../intersections';

export class GetConnectionLineRequest {

  constructor(
      public outputRect: IConnectorShape,
      public inputRect: IConnectorShape,
      public behavior: EFConnectionBehavior | string,
      public outputSide: EFConnectableSide,
      public inputSide: EFConnectableSide,
  ) {

  }
}
