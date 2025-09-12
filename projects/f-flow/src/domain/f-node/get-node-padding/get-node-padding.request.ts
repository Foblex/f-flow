import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/2d';

export class GetNodePaddingRequest {
  static readonly fToken = Symbol('GetNodePaddingRequest');
  constructor(
    public fNode: FNodeBase,
    public rect: IRect,
  ) {
  }
}
