import { IRect } from '@foblex/2d';
import { INodeResizeRestrictions } from '../get-node-resize-restrictions';

export class ApplyChildResizeRestrictionsRequest {

  constructor(
    public rect: IRect,
    public restrictions: INodeResizeRestrictions
  ) {
  }
}
