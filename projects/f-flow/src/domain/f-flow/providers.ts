import { GetFlowHostElementExecution } from './get-flow-host-element';
import { AddFlowToStoreExecution } from './add-flow-to-store';
import { RemoveFlowFromStoreExecution } from './remove-flow-from-store';
import { GetFlowExecution } from './get-flow';
import { GET_FLOW_STATE_PROVIDERS } from './get-flow-state';

/**
 * Providers for managing the Flow in the FComponentsStore.
 * This includes adding, retrieving, and removing the Flow,
 * as well as getting the Flow host element and its state.
 */
export const F_FLOW_FEATURES = [

  AddFlowToStoreExecution,

  GetFlowExecution,

  GetFlowHostElementExecution,

  ...GET_FLOW_STATE_PROVIDERS,

  RemoveFlowFromStoreExecution,
];
