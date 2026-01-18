import { EFConnectionBehavior, EFConnectionType } from '../../../f-connection-v2';

export interface IFFlowStateConnection {
  id: string;

  fOutputId: string;

  fInputId: string;

  fType: EFConnectionType | string;

  fBehavior: EFConnectionBehavior;

  isSelected: boolean;
}
