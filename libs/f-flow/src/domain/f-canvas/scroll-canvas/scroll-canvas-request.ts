import { IPoint } from '@foblex/2d';

export class ScrollCanvasRequest {
  static readonly fToken = Symbol('ScrollCanvasRequest');
  constructor(public readonly delta: IPoint) {}
}
