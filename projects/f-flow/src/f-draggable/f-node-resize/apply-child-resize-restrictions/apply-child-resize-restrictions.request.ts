import { IRect } from '@foblex/2d';
import { INodeResizeRestrictions } from '../get-node-resize-restrictions';

export class ApplyChildResizeRestrictionsRequest {
  static readonly fToken = Symbol('ApplyChildResizeRestrictionsRequest');

  constructor(
    public rect: IRect,
    public restrictions: INodeResizeRestrictions
  ) {
  }
}
