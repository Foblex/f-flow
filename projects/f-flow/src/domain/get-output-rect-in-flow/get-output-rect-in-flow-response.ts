import { EFConnectableSide } from '../../f-connectors';
import { IRoundedRect } from '../intersections';

export class GetOutputRectInFlowResponse {
  constructor(
      public rect: IRoundedRect,
      public fConnectableSide: EFConnectableSide
  ) {
  }
}
