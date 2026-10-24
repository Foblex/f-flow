import { IPoint } from '@foblex/2d';

export class UpdateScaleRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('UpdateScaleRequest');
  constructor(
    public readonly scale: number,
    public readonly toPosition: IPoint,
  ) {}
}
