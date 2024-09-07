import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/core';

export class GetNodePaddingRequest {

  constructor(
    public fNode: FNodeBase,
    public rect: IRect
  ) {
  }
}
