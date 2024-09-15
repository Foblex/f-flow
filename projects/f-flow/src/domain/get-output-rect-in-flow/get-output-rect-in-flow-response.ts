import { EFConnectableSide } from '../../f-connectors';
import { IRoundedRect } from '@foblex/2d';

export class GetOutputRectInFlowResponse {
  constructor(
      public rect: IRoundedRect,
      public fConnectableSide: EFConnectableSide
  ) {
  }
}
