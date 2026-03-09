import { IRect } from '@foblex/2d';

export class SetFCacheNodeRectRequest {
  static readonly fToken = Symbol('SetFCacheNodeRectRequest');

  constructor(
    public readonly nodeId: string,
    public readonly rect: IRect,
  ) {}
}
