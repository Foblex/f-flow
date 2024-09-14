import { IPoint, IRect } from '@foblex/2d';

export interface ICanOneToOneCentering {

  oneToOneCentering(rect: IRect, parentRect: IRect, points: IPoint[]): void;
}
