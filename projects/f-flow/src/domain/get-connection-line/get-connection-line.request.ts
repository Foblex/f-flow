import { EFConnectionBehavior } from '../../f-connection';
import { EFConnectableSide } from '../../f-connectors';
import { IRoundedRect } from '@foblex/2d';

export class GetConnectionLineRequest {

  constructor(
      public outputRect: IRoundedRect,
      public inputRect: IRoundedRect,
      public behavior: EFConnectionBehavior | string,
      public outputSide: EFConnectableSide,
      public inputSide: EFConnectableSide,
  ) {

  }
}
