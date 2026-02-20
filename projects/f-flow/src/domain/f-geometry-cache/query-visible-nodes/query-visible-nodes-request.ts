import { IRect } from '@foblex/2d';

export class QueryVisibleNodesRequest {
  static readonly fToken = Symbol('QueryVisibleNodesRequest');

  constructor(public readonly visibleWorldRect: IRect) {}
}
