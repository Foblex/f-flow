import { FConnectorBase } from '../../f-connector-base';

export class CalculateConnectorConnectableSideRequest {

  constructor(
      public fConnector: FConnectorBase,
      public fNodeHost: HTMLElement | SVGElement
  ) {
  }
}
