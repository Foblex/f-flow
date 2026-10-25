import { IPoint } from '../../_libs/f-2d';

export class GetNormalizedPointRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: IPoint;

  static readonly fToken = Symbol('GetNormalizedPointRequest');

  constructor(public readonly position: IPoint) {}
}
