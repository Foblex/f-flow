import { EFConnectionBehavior, EFConnectionType } from '../../../f-connection';

export interface IFFlowStateConnection {

  id: string;

  fOutputId: string;

  fInputId: string;

  fType: EFConnectionType | string;

  fBehavior: EFConnectionBehavior;

  isSelected: boolean;
}
