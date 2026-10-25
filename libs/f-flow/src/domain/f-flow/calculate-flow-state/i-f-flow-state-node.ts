import { IPoint, ISize } from '../../../_libs/f-2d';
import { IFFlowStateConnector } from './i-f-flow-state-connector';

export interface IFFlowStateNode {
  id: string;

  parentId?: string;

  position: IPoint;

  size?: ISize;

  measuredSize?: ISize;

  rotate: number;

  fInputs: IFFlowStateConnector[];

  fOutputs: IFFlowStateConnector[];

  isSelected: boolean;
}
