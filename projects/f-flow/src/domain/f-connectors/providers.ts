import { AddInputToStoreExecution } from './add-input-to-store';
import { AddOutletToStoreExecution } from './add-outlet-to-store';
import { AddOutputToStoreExecution } from './add-output-to-store';
import { RemoveInputFromStoreExecution } from './remove-input-from-store';
import { RemoveOutletFromStoreExecution } from './remove-outlet-from-store';
import { RemoveOutputFromStoreExecution } from './remove-output-from-store';
import { MarkAllCanBeConnectedInputsExecution } from './mark-all-can-be-connected-inputs';
import { UnmarkAllCanBeConnectedInputsExecution } from './unmark-all-can-be-connected-inputs';
import { GetAllCanBeConnectedInputsAndRectsExecution } from './get-all-can-be-connected-inputs-and-rects';
import { GetConnectorAndRectExecution } from './get-connector-and-rect';
import { CalculateClosestInputExecution } from './calculate-closest-input';
import { FindInputAtPositionExecution } from './find-input-at-position';

export const F_CONNECTORS_FEATURES = [

  AddInputToStoreExecution,

  AddOutletToStoreExecution,

  AddOutputToStoreExecution,

  CalculateClosestInputExecution,

  FindInputAtPositionExecution,

  GetAllCanBeConnectedInputsAndRectsExecution,

  GetConnectorAndRectExecution,

  MarkAllCanBeConnectedInputsExecution,

  RemoveInputFromStoreExecution,

  RemoveOutletFromStoreExecution,

  RemoveOutputFromStoreExecution,

  UnmarkAllCanBeConnectedInputsExecution
];
