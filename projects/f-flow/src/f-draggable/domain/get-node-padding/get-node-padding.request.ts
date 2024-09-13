import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/2d';

export class GetNodePaddingRequest {

  constructor(
    public fNode: FNodeBase,
    public rect: IRect
  ) {
  }
}
