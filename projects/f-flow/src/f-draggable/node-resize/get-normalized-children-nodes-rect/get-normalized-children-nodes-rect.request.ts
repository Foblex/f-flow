import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/core';

export class GetNormalizedChildrenNodesRectRequest {

  constructor(
    public fNode: FNodeBase,
    public rect: IRect
  ) {
  }
}
