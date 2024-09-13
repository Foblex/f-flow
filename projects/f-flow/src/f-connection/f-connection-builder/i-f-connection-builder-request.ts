import { IPoint } from '@foblex/2d';
import { EFConnectableSide } from '../../f-connectors';

export interface IFConnectionBuilderRequest {

  source: IPoint;

  sourceSide: EFConnectableSide;

  target: IPoint;

  targetSide: EFConnectableSide;

  radius: number;

  offset: number;
}
