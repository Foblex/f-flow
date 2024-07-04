import { IRect } from '@foblex/core';
import { EFConnectableSide } from '../../f-connectors';

export class GetInputRectInFlowResponse {
  constructor(
      public rect: IRect,
      public fConnectableSide: EFConnectableSide
  ) {
  }
}
