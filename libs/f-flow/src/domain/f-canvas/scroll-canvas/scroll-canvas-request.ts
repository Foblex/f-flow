import { IPoint } from '@foblex/2d';

export class ScrollCanvasRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('ScrollCanvasRequest');
  constructor(public readonly delta: IPoint) {}
}
