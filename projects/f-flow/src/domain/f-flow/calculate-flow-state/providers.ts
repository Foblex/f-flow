import { CalculateFlowState } from './calculate-flow-state';
import { CalculateNodesState } from './calculate-nodes-state';
import { CalculateConnectionsState } from './calculate-connections-state';

/**
 * Providers for retrieving the current Flow state, including nodes, groups, and connections.
 */
export const GET_FLOW_STATE_PROVIDERS = [
  CalculateFlowState,

  CalculateNodesState,

  CalculateConnectionsState,
];
