import { IRect } from '@foblex/2d';

export class SetModelNodeRectRequest {
  static readonly fToken = Symbol('SetModelNodeRectRequest');

  constructor(
    public readonly nodeId: string,
    public readonly worldRect: IRect,
  ) {}
}
