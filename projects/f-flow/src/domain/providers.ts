import { GetIncomingConnectionsHandler } from './get-incoming-connections.handler';
import { GetOutgoingConnectionsHandler } from './get-outgoing-connections.handler';
import { GetConnectionHandler } from './get-connection.handler';
import { GetConnectionLineExecution } from './get-connection-line';
import { RedrawConnectionsExecution } from './redraw-connections';
import { GetOutputRectInFlowExecution } from './get-output-rect-in-flow';
import { GetSelectionExecution } from './get-selection';
import { SelectAllExecution } from './select-all';
import { ClearSelectionExecution } from './clear-selection';
import { GetNodesRectExecution } from './get-nodes-rect';
import { GetElementRectInFlowExecution } from './get-element-rect-in-flow';
import { GetInputRectInFlowExecution } from './get-input-rect-in-flow';
import { SelectExecution } from './select';
import { UpdateItemLayerExecution } from './update-item-layer';
import { GetPositionInFlowExecution } from './get-position-in-flow';
import { CreateConnectionMarkersExecution } from './create-connection-markers';
import { GetCanBeSelectedItemsExecution } from './get-can-be-selected-items';
import { IsConnectionUnderNodeExecution } from './is-connection-under-node';
import { SelectAndUpdateNodeLayerExecution } from './select-and-update-node-layer';
import { GetExternalNodesRectExecution } from './get-external-nodes-rect';

export const COMMON_PROVIDERS = [

  ClearSelectionExecution,

  CreateConnectionMarkersExecution,

  GetCanBeSelectedItemsExecution,

  GetConnectionLineExecution,

  GetElementRectInFlowExecution,

  GetExternalNodesRectExecution,

  GetNodesRectExecution,

  GetOutputRectInFlowExecution,

  GetPositionInFlowExecution,

  GetSelectionExecution,

  IsConnectionUnderNodeExecution,

  RedrawConnectionsExecution,

  SelectExecution,

  SelectAllExecution,

  SelectAndUpdateNodeLayerExecution,

  UpdateItemLayerExecution,



  GetConnectionHandler,


  GetInputRectInFlowExecution,

  GetIncomingConnectionsHandler,

  GetOutgoingConnectionsHandler,

];
