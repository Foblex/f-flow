import { IPoint } from '../../../../_libs/f-2d';
import { EFConnectableSide } from '../../../enums';

export interface IFConnectionBuilderRequest {
  source: IPoint;

  sourceSide: EFConnectableSide;

  target: IPoint;

  targetSide: EFConnectableSide;

  radius: number;

  offset: number;

  waypoints: IPoint[];
}
