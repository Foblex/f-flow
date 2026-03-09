import { AddFlowToStore } from './add-flow-to-store';
import { RemoveFlowFromStore } from './remove-flow-from-store';
import { GetFlow } from './get-flow';
import { GET_FLOW_STATE_PROVIDERS } from './calculate-flow-state';

/**
 * Providers for managing the Flow in the FComponentsStore.
 * This includes adding, retrieving, and removing the Flow,
 * as well as getting the Flow host element and its state.
 */
export const F_FLOW_FEATURES = [
  AddFlowToStore,

  GetFlow,

  ...GET_FLOW_STATE_PROVIDERS,

  RemoveFlowFromStore,
];
