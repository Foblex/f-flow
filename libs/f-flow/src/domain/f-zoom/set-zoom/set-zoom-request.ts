import { IPoint } from '@foblex/2d';

export class SetZoomRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('SetZoomRequest');
  constructor(
    public readonly position: IPoint,
    public readonly step: number,
    public readonly direction: number,
    public readonly animate: boolean = false,
  ) {}
}
