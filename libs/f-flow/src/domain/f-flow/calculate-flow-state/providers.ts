import { CalculateFlowState } from './calculate-flow-state';
import { CalculateNodesState } from './calculate-nodes-state';
import { CalculateConnectionsState } from './calculate-connections-state';
import { fExecution } from '../../../_libs/f-mediator';
import { CalculateConnectionsStateRequest } from './calculate-connections-state/calculate-connections-state-request';
import { CalculateFlowStateRequest } from './calculate-flow-state-request';
import { CalculateNodesStateRequest } from './calculate-nodes-state/calculate-nodes-state-request';

/**
 * Providers for retrieving the current Flow state, including nodes, groups, and connections.
 */
export const GET_FLOW_STATE_PROVIDERS = [
  fExecution(CalculateFlowStateRequest, CalculateFlowState),

  fExecution(CalculateNodesStateRequest, CalculateNodesState),

  fExecution(CalculateConnectionsStateRequest, CalculateConnectionsState),
];
