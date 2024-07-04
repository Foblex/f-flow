import { IPoint } from '@foblex/core';
import { EFConnectableSide } from '../../f-connectors';

export interface IFConnectionBuilderRequest {

  source: IPoint;

  sourceSide: EFConnectableSide;

  target: IPoint;

  targetSide: EFConnectableSide;

  radius: number;

  offset: number;
}
