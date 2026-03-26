import { HeroConnectionStyle } from '../enums/hero-connection-style';
import { EFConnectionBehavior, EFConnectionConnectableSide, EFConnectionType } from '@foblex/flow';

export interface HeroConnection {
  source: string;
  target: string;
  style: HeroConnectionStyle;
  type: EFConnectionType;
  behaviour: EFConnectionBehavior;
  sourceSide?: EFConnectionConnectableSide;
  targetSide?: EFConnectionConnectableSide;
}
