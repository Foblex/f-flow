import { EFConnectableSide } from '@foblex/flow';
import { IPoint } from '@foblex/core';

export interface IHeroFlowNode {

  uid: string;

  position: IPoint;

  to: EFConnectableSide;

  from: EFConnectableSide;

  large?: boolean;

  text?: string;
}
