import { IPoint } from '@foblex/2d';

export class SetZoomRequest {
  static readonly fToken = Symbol('SetZoomRequest');
  constructor(
    public readonly position: IPoint,
    public readonly step: number,
    public readonly direction: number,
    public readonly animate: boolean = false,
  ) {}
}
