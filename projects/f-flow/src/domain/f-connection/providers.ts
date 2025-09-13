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
import { CalculateConnectionLineByBehavior } from './calculate-connection-line-by-behavior';

/**
 * This file exports all the connection-related features for the F-Flow domain.
 */
export const F_CONNECTION_FEATURES = [
  AddConnectionForCreateToStoreExecution,

  AddConnectionMarkerToStoreExecution,

  AddConnectionToStoreExecution,

  AddSnapConnectionToStoreExecution,

  CreateConnectionMarkersExecution,

  CalculateConnectionLineByBehavior,

  RedrawConnectionsExecution,

  RemoveConnectionForCreateFromStoreExecution,

  RemoveConnectionFromStoreExecution,

  RemoveConnectionMarkerFromStoreExecution,

  RemoveSnapConnectionFromStoreExecution,
];
