import { AddInputToStoreExecution } from './add-input-to-store';
import { AddOutletToStoreExecution } from './add-outlet-to-store';
import { AddOutputToStoreExecution } from './add-output-to-store';
import { RemoveInputFromStoreExecution } from './remove-input-from-store';
import { RemoveOutletFromStoreExecution } from './remove-outlet-from-store';
import { RemoveOutputFromStoreExecution } from './remove-output-from-store';
import { MarkConnectableConnectorsExecution } from './mark-connectable-connectors';
import { UnmarkConnectableConnectorsExecution } from './unmark-connectable-connectors';
import { GetAllCanBeConnectedInputsAndRectsExecution } from './get-all-can-be-connected-inputs-and-rects';
import { GetConnectorAndRectExecution } from './get-connector-and-rect';
import { FindClosestConnectorExecution } from './find-closest-connector';
import {
  GetAllCanBeConnectedSourceConnectorsAndRectsExecution
} from "./get-all-can-be-connected-source-connectors-and-rects";
import {
  FindConnectableConnectorUsingPriorityAndPositionExecution
} from "./find-connectable-connector-using-priority-and-position";

export const F_CONNECTORS_FEATURES = [

  AddInputToStoreExecution,

  AddOutletToStoreExecution,

  AddOutputToStoreExecution,

  FindClosestConnectorExecution,

  FindConnectableConnectorUsingPriorityAndPositionExecution,

  GetAllCanBeConnectedSourceConnectorsAndRectsExecution,

  GetAllCanBeConnectedInputsAndRectsExecution,

  GetConnectorAndRectExecution,

  MarkConnectableConnectorsExecution,

  RemoveInputFromStoreExecution,

  RemoveOutletFromStoreExecution,

  RemoveOutputFromStoreExecution,

  UnmarkConnectableConnectorsExecution
];
