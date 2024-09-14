import { IPoint } from '@foblex/2d';

export interface ICanChangeZoom {

  setZoom(value: number, toPosition: IPoint): void;

  setScalePosition(value: IPoint): void;

  resetZoom(): void;
}
