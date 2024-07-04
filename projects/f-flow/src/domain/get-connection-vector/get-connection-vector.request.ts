import { IRect } from '@foblex/core';
import { EFConnectionBehavior } from '../../f-connection';
import { EFConnectableSide } from '../../f-connectors';

export class GetConnectionVectorRequest {

  constructor(
      public outputRect: IRect,
      public inputRect: IRect,
      public behavior: EFConnectionBehavior | string,
      public outputSide: EFConnectableSide,
      public inputSide: EFConnectableSide,
  ) {

  }
}
