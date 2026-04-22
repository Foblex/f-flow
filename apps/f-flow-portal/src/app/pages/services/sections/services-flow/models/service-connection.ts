import { ServiceConnectionStyle } from '../enums/service-connection-style';
import { EFConnectionBehavior, EFConnectionConnectableSide, EFConnectionType } from '@foblex/flow';

export interface ServiceConnection {
  source: string;
  target: string;
  style: ServiceConnectionStyle;
  type: EFConnectionType;
  behaviour: EFConnectionBehavior;
  sourceSide?: EFConnectionConnectableSide;
  targetSide?: EFConnectionConnectableSide;
}
