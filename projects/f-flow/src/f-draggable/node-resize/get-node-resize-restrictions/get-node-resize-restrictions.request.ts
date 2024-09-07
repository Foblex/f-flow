import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/core';

export class GetNodeResizeRestrictionsRequest {

  constructor(
    public fNode: FNodeBase,
    public rect: IRect
  ) {
  }
}
