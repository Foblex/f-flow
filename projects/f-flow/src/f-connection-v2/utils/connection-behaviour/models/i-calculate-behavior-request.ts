import { IPoint, IRoundedRect } from '@foblex/2d';
import { EFConnectableSide } from '../../../enums';

export interface IConnectionEndpointRotationContext {
  rotationDeg: number;
  pivot: IPoint;
}

export interface ICalculateBehaviorRequest {
  sourceRect: IRoundedRect;
  targetRect: IRoundedRect;
  sourceConnectableSide: EFConnectableSide;
  targetConnectableSide: EFConnectableSide;
  sourceRotationContext?: IConnectionEndpointRotationContext;
  targetRotationContext?: IConnectionEndpointRotationContext;
}
