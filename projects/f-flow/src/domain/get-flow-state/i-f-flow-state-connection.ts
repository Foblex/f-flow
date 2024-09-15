import { EFConnectionBehavior, EFConnectionType } from '../../f-connection';

export interface IFFlowStateConnection {

  id: string;

  fOutputId: string;

  fInputId: string;

  fType: EFConnectionType;

  fBehavior: EFConnectionBehavior;

  isSelected: boolean;
}
