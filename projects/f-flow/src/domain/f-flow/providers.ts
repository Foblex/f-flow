import { GetFlowHostElementExecution } from './get-flow-host-element';
import { AddFlowToStoreExecution } from './add-flow-to-store';
import { RemoveFlowFromStoreExecution } from './remove-flow-from-store';
import { GetFlowExecution } from './get-flow';
import { GET_FLOW_STATE_PROVIDERS } from './get-flow-state';

export const F_FLOW_FEATURES = [

  AddFlowToStoreExecution,

  GetFlowExecution,

  GetFlowHostElementExecution,

  ...GET_FLOW_STATE_PROVIDERS,

  RemoveFlowFromStoreExecution
];
