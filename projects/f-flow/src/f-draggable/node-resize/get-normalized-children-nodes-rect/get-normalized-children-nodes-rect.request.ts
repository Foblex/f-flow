import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/2d';

export class GetNormalizedChildrenNodesRectRequest {

  constructor(
    public fNode: FNodeBase,
    public rect: IRect
  ) {
  }
}
