import { IFStateNode } from '@foblex/flow';
import { CallCenterNodeValueByType } from './call-center-node-value';
import { ECallCenterNodeType } from './e-call-center-node-type';

export interface ICallCenterNode<
  TType extends ECallCenterNodeType = ECallCenterNodeType,
> extends IFStateNode {
  description?: string;
  isExpanded?: boolean;
  outputs: ICallCenterNodeOutput[];
  input?: string;
  type: TType;
  value: CallCenterNodeValueByType<TType>;
}

export interface ICallCenterNodeOutput {
  id: string;
  label: string;
}

export type CallCenterNodeRecord = {
  [TType in ECallCenterNodeType]: ICallCenterNode<TType>;
}[ECallCenterNodeType];
