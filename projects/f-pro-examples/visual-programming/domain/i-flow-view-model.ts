import { IFlowConnectionViewModel } from './connection/i-flow-connection-view-model';
import { IFlowNodeViewModel } from './node/i-flow-node-view-model';

export interface IFlowViewModel {

  nodes: IFlowNodeViewModel[];

  connections: IFlowConnectionViewModel[];
}
