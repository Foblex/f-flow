import { IFFlowStateNode } from './i-f-flow-state-node';
import { IFFlowStateConnection } from './i-f-flow-state-connection';
import { IPoint } from '@foblex/2d';

export interface IFFlowState {

  position: IPoint;

  scale: number;

  nodes: IFFlowStateNode[];

  groups: IFFlowStateNode[];

  connections: IFFlowStateConnection[];
}
