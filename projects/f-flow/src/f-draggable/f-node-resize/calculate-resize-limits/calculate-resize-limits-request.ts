import { FNodeBase } from '../../../f-node';
import { IRect } from '@foblex/2d';

export class CalculateResizeLimitsRequest {
  static readonly fToken = Symbol('CalculateResizeLimitsRequest');

  constructor(
    public nodeOrGroup: FNodeBase,
    public rect: IRect,
  ) {
  }
}
