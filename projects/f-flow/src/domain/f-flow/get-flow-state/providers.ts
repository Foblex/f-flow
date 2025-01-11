import { GetFlowStateExecution } from './get-flow-state.execution';
import { GetFlowStateNodesExecution } from './get-flow-state-nodes';
import { GetFlowStateConnectionsExecution } from './get-flow-state-connections';

export const GET_FLOW_STATE_PROVIDERS = [

  GetFlowStateExecution,

  GetFlowStateNodesExecution,

  GetFlowStateConnectionsExecution
];
