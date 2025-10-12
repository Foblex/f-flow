import { IRoundedRect } from '@foblex/2d';
import { EFConnectableSide } from '../../../../f-connectors';

export interface CalculateBehaviorRequest {
  sourceRect: IRoundedRect;
  targetRect: IRoundedRect;
  sourceConnectableSide: EFConnectableSide;
  targetConnectableSide: EFConnectableSide;
}
