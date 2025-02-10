import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/2d';

export class GetNodeResizeRestrictionsRequest {

  constructor(
    public fNode: FNodeBase,
    public rect: IRect
  ) {
  }
}
