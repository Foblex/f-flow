import { GetFlowStateExecution } from './get-flow-state.execution';
import { GetFlowStateNodesExecution } from './get-flow-state-nodes';
import { GetFlowStateConnectionsExecution } from './get-flow-state-connections';

/**
 * Providers for retrieving the current Flow state, including nodes, groups, and connections.
 */
export const GET_FLOW_STATE_PROVIDERS = [

  GetFlowStateExecution,

  GetFlowStateNodesExecution,

  GetFlowStateConnectionsExecution,
];
