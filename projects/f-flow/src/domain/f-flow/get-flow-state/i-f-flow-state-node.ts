import { IPoint, ISize } from '@foblex/2d';
import { IFFlowStateConnector } from './i-f-flow-state-connector';

export interface IFFlowStateNode {

  id: string;

  parentId?: string;

  position: IPoint;

  size?: ISize;

  rotate: number;

  fInputs: IFFlowStateConnector[];

  fOutputs: IFFlowStateConnector[];

  isSelected: boolean;
}
