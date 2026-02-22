import { CreateConnectionMarkers } from './create-connection-markers';
import { AddConnectionForCreateToStore } from './add-connection-for-create-to-store';
import { AddConnectionToStore } from './add-connection-to-store';
import { AddSnapConnectionToStore } from './add-snap-connection-to-store';
import { RemoveConnectionForCreateFromStore } from './remove-connection-for-create-from-store';
import { RemoveConnectionFromStore } from './remove-connection-from-store';
import { RemoveSnapConnectionFromStore } from './remove-snap-connection-from-store';
import { AddConnectionMarkerToStore } from './add-connection-marker-to-store';
import { RemoveConnectionMarkerFromStore } from './remove-connection-marker-from-store';
import { RedrawConnections } from './redraw-connections';
import { RemoveConnectionWaypoint } from './remove-connection-waypoint';
import { FConnectionCalculationWorker } from './connection-calculation-worker';

/**
 * This file exports all the connection-related features for the F-Flow domain.
 */
export const F_CONNECTION_FEATURES = [
  AddConnectionForCreateToStore,

  AddConnectionMarkerToStore,

  AddConnectionToStore,

  AddSnapConnectionToStore,

  CreateConnectionMarkers,

  FConnectionCalculationWorker,

  RedrawConnections,

  RemoveConnectionForCreateFromStore,

  RemoveConnectionFromStore,

  RemoveConnectionMarkerFromStore,

  RemoveSnapConnectionFromStore,

  RemoveConnectionWaypoint,
];
