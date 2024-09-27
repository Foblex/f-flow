import { FindClosestInputUsingSnapThresholdExecution } from './find-closest-input-using-snap-threshold';
import { GetAllCanBeConnectedInputPositionsExecution } from './get-all-can-be-connected-input-positions';
import { GetConnectorWithRectExecution } from './get-connector-with-rect';
import { AddConnectionToStoreExecution } from './add-connection-to-store';
import { RemoveConnectionFromStoreExecution } from './remove-connection-from-store';

export const F_CONNECTION_FEATURES = [

  AddConnectionToStoreExecution,

  FindClosestInputUsingSnapThresholdExecution,

  GetAllCanBeConnectedInputPositionsExecution,

  GetConnectorWithRectExecution,

  RemoveConnectionFromStoreExecution
];
