import { IPoint } from '@foblex/2d';
import { IControlPointCandidate } from '../../../components';

export interface IFConnectionBuilderResponse {
  path: string;

  connectionCenter?: IPoint;

  penultimatePoint: IPoint;

  secondPoint: IPoint;

  points?: IPoint[];

  candidates?: IControlPointCandidate[];
}
