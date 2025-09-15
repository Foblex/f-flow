import { IPoint } from '@foblex/2d';

export interface IFConnectionBuilderResponse {
  path: string;

  connectionCenter: IPoint;

  penultimatePoint: IPoint;

  secondPoint: IPoint;

  points?: IPoint[];
}
