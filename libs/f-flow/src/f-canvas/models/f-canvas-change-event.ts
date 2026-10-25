import { IPoint } from '../../_libs/f-2d';

export class FCanvasChangeEvent {
  constructor(
    public readonly position: IPoint,
    public readonly scale: number,
  ) {}
}
