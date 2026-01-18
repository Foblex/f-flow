import { IRoundedRect } from '@foblex/2d';
import { EFConnectableSide } from '../../../enums';

export interface ICalculateBehaviorRequest {
  sourceRect: IRoundedRect;
  targetRect: IRoundedRect;
  sourceConnectableSide: EFConnectableSide;
  targetConnectableSide: EFConnectableSide;
}
