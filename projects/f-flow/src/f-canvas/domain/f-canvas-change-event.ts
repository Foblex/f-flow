import { IPoint } from '@foblex/2d';

export class FCanvasChangeEvent {
  constructor(
    public readonly position: IPoint,
    public readonly scale: number,
  ) {}
}
