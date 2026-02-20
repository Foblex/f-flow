import { IPoint } from '@foblex/2d';

export class UpdateNodeDragDeltaRequest {
  static readonly fToken = Symbol('UpdateNodeDragDeltaRequest');

  constructor(
    public readonly nodeId: string,
    public readonly delta: IPoint,
  ) {}
}
