import { IPoint } from '@foblex/2d';

export class SetZoomRequest {
  static readonly fToken = Symbol('SetZoomRequest');
  constructor(
    public position: IPoint,
    public step: number,
    public direction: number,
    public animate: boolean = false,
  ) {
  }
}
