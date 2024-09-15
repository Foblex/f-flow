import { EFConnectableSide } from '@foblex/flow';
import { IPoint } from '@foblex/2d';

export interface IHeroFlowNode {

  uid: string;

  position: IPoint;

  to: EFConnectableSide;

  from: EFConnectableSide;

  large?: boolean;

  text?: string;
}
