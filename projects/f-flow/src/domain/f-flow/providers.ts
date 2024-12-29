import { GetFlowHostElementExecution } from './get-flow-host-element';
import { AddFlowToStoreExecution } from './add-flow-to-store';
import { RemoveFlowFromStoreExecution } from './remove-flow-from-store';
import { GetFlowExecution } from './get-flow';

export const F_FLOW_FEATURES = [

  AddFlowToStoreExecution,

  GetFlowExecution,

  GetFlowHostElementExecution,

  RemoveFlowFromStoreExecution
];
