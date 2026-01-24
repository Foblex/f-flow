import {
  EFConnectionBehavior,
  EFConnectionConnectableSide,
  EFConnectionType,
} from '../../../f-connection-v2';
import { IPoint } from '@foblex/2d';

export interface IFFlowStateConnection {
  id: string;

  fOutputId: string;

  fInputId: string;

  fType: EFConnectionType | string;

  fBehavior: EFConnectionBehavior;

  isSelected: boolean;

  pivots: IPoint[];

  fInputSide: EFConnectionConnectableSide;

  fOutputSide: EFConnectionConnectableSide;
}
