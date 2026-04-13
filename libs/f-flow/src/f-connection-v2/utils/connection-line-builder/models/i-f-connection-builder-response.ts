import { IPoint } from '@foblex/2d';

export interface IFConnectionBuilderResponse {
  path: string;

  penultimatePoint: IPoint;

  secondPoint: IPoint;

  points: IPoint[];

  candidates: IPoint[];
}
