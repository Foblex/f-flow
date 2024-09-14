import { IPoint, IRect } from '@foblex/2d';

export interface ICanFitToParent {

  fitToParent(rect: IRect, parentRect: IRect, points: IPoint[], toCenter: IPoint): void;
}

