import { EFConnectableSide } from '../../f-connectors';
import { IRoundedRect } from '../intersections';

export class GetInputRectInFlowResponse {
  constructor(
      public rect: IRoundedRect,
      public fConnectableSide: EFConnectableSide
  ) {
  }
}
