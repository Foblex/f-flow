import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/2d';

export class GetNodeResizeRestrictionsRequest {
  static readonly fToken = Symbol('GetNodeResizeRestrictionsRequest');

  constructor(
    public fNode: FNodeBase,
    public rect: IRect
  ) {
  }
}
