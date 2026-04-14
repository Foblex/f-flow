import { FlowStateNode } from './i-flow-state-node';
import { IPoint } from '@foblex/2d';
import { IFlowStateConnection } from './i-flow-state-connection';

export interface IFlowState {
  nodes: Record<string, FlowStateNode>;
  connections: Record<string, IFlowStateConnection>;
  selection?: IFlowStateSelection;
  transform?: {
    position: IPoint;
    scale: number;
  };
}

export interface IFlowStateSelection {
  nodes: string[];
  connections: string[];
}
