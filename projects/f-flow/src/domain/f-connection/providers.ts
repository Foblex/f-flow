import { FindClosestInputUsingSnapThresholdExecution } from './find-closest-input-using-snap-threshold';
import { GetAllCanBeConnectedInputPositionsExecution } from './get-all-can-be-connected-input-positions';
import { GetConnectorWithRectExecution } from './get-connector-with-rect';
import { CreateConnectionMarkersExecution } from './create-connection-markers';
import { AddConnectionForCreateToStoreExecution } from './add-connection-for-create-to-store';
import { AddConnectionToStoreExecution } from './add-connection-to-store';
import { AddSnapConnectionToStoreExecution } from './add-snap-connection-to-store';
import { RemoveConnectionForCreateFromStoreExecution } from './remove-connection-for-create-from-store';
import { RemoveConnectionFromStoreExecution } from './remove-connection-from-store';
import { RemoveSnapConnectionFromStoreExecution } from './remove-snap-connection-from-store';
import { AddConnectionMarkerToStoreExecution } from './add-connection-marker-to-store';
import { RemoveConnectionMarkerFromStoreExecution } from './remove-connection-marker-from-store';
import { RedrawConnectionsExecution } from './redraw-connections';
import { CalculateConnectionLineByBehaviorExecution } from './calculate-connection-line-by-behavior';

export const F_CONNECTION_FEATURES = [

  AddConnectionForCreateToStoreExecution,

  AddConnectionMarkerToStoreExecution,

  AddConnectionToStoreExecution,

  AddSnapConnectionToStoreExecution,

  CreateConnectionMarkersExecution,

  FindClosestInputUsingSnapThresholdExecution,

  GetAllCanBeConnectedInputPositionsExecution,

  CalculateConnectionLineByBehaviorExecution,

  GetConnectorWithRectExecution,

  RedrawConnectionsExecution,

  RemoveConnectionForCreateFromStoreExecution,

  RemoveConnectionFromStoreExecution,

  RemoveConnectionMarkerFromStoreExecution,

  RemoveSnapConnectionFromStoreExecution
];
