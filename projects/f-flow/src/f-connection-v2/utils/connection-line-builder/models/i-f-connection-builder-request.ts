import { IPoint } from '@foblex/2d';
import { EFConnectableSide } from '../../../enums';
import { IControlPoint } from '../../../components';

export interface IFConnectionBuilderRequest {
  source: IPoint;

  sourceSide: EFConnectableSide;

  target: IPoint;

  targetSide: EFConnectableSide;

  radius: number;

  offset: number;

  pivots: IControlPoint[];
}
