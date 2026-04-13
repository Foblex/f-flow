import { AddConnectionForCreateToStore } from './add-connection-for-create-to-store';
import { AddConnectionMarkerToStore } from './add-connection-marker-to-store';
import { AddConnectionToStore } from './add-connection-to-store';
import { AddSnapConnectionToStore } from './add-snap-connection-to-store';
import { CreateConnectionMarkers } from './create-connection-markers';
import {
  ApplyConnectionRender,
  ApplyConnectionWorkerResult,
  BuildConnectionLine,
  BuildConnectionWorkerBatch,
  BuildConnectionWorkerPayloadItem,
  CompleteConnectionRedraw,
  ConnectionRedrawState,
  ConnectionWorkerState,
  DisableConnectionWorker,
  EnsureConnectionWorker,
  HandleConnectionWorkerMessage,
  IsConnectionRedrawCurrent,
  IsConnectionWorkerEnabled,
  MarkConnectionConnectorsAsConnected,
  RedrawConnections,
  RenderConnection,
  RenderConnectionFromGeometry,
  RenderConnectionWithLine,
  ResolveConnectionEndpointRect,
  ResolveConnectionEndpoints,
  ResolveConnectionGeometry,
  ResetConnectionWorkerRuntime,
  RunConnectionRedrawSlice,
  RunConnectionWorker,
  RunConnectionWorkerBatch,
  ShouldUseConnectionWorker,
  StartConnectionRedraw,
  StartConnectionWorkerRedraw,
} from './redraw-connections';
import { RemoveConnectionForCreateFromStore } from './remove-connection-for-create-from-store';
import { RemoveConnectionFromStore } from './remove-connection-from-store';
import { RemoveConnectionMarkerFromStore } from './remove-connection-marker-from-store';
import { RemoveConnectionWaypoint } from './remove-connection-waypoint';
import { RemoveSnapConnectionFromStore } from './remove-snap-connection-from-store';
import { ResolveConnectionEndpointRotationContext } from './resolve-connection-endpoint-rotation-context';

/**
 * This file exports all the connection-related features for the F-Flow domain.
 */
export const F_CONNECTION_FEATURES = [
  ConnectionRedrawState,
  ConnectionWorkerState,

  AddConnectionForCreateToStore,
  AddConnectionMarkerToStore,
  AddConnectionToStore,
  AddSnapConnectionToStore,

  CreateConnectionMarkers,

  ApplyConnectionWorkerResult,
  ApplyConnectionRender,
  BuildConnectionLine,
  BuildConnectionWorkerBatch,
  BuildConnectionWorkerPayloadItem,
  CompleteConnectionRedraw,
  DisableConnectionWorker,
  EnsureConnectionWorker,
  HandleConnectionWorkerMessage,
  IsConnectionRedrawCurrent,
  IsConnectionWorkerEnabled,
  MarkConnectionConnectorsAsConnected,
  RedrawConnections,
  RenderConnection,
  RenderConnectionFromGeometry,
  RenderConnectionWithLine,
  ResolveConnectionEndpointRect,
  ResolveConnectionEndpointRotationContext,
  ResolveConnectionEndpoints,
  ResolveConnectionGeometry,
  ResetConnectionWorkerRuntime,
  RunConnectionRedrawSlice,
  RunConnectionWorker,
  RunConnectionWorkerBatch,
  ShouldUseConnectionWorker,
  StartConnectionRedraw,
  StartConnectionWorkerRedraw,

  RemoveConnectionForCreateFromStore,
  RemoveConnectionFromStore,
  RemoveConnectionMarkerFromStore,
  RemoveSnapConnectionFromStore,
  RemoveConnectionWaypoint,
];
