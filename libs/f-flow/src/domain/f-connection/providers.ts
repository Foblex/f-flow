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
  DisposeConnectionWorker,
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
import { fExecution } from '../../_libs/f-mediator';
import { AddConnectionForCreateToStoreRequest } from './add-connection-for-create-to-store/add-connection-for-create-to-store-request';
import { AddConnectionMarkerToStoreRequest } from './add-connection-marker-to-store/add-connection-marker-to-store-request';
import { AddConnectionToStoreRequest } from './add-connection-to-store/add-connection-to-store-request';
import { AddSnapConnectionToStoreRequest } from './add-snap-connection-to-store/add-snap-connection-to-store-request';
import { ApplyConnectionRenderRequest } from './redraw-connections/main-thread/apply-connection-render/apply-connection-render-request';
import { ApplyConnectionWorkerResultRequest } from './redraw-connections/worker/apply-connection-worker-result/apply-connection-worker-result-request';
import { BuildConnectionLineRequest } from './redraw-connections/shared/build-connection-line/build-connection-line-request';
import { BuildConnectionWorkerBatchRequest } from './redraw-connections/worker/build-connection-worker-batch/build-connection-worker-batch-request';
import { BuildConnectionWorkerPayloadItemRequest } from './redraw-connections/worker/build-connection-worker-payload-item/build-connection-worker-payload-item-request';
import { CompleteConnectionRedrawRequest } from './redraw-connections/pipeline/complete-connection-redraw/complete-connection-redraw-request';
import { CreateConnectionMarkersRequest } from './create-connection-markers/create-connection-markers-request';
import { DisableConnectionWorkerRequest } from './redraw-connections/worker/disable-connection-worker/disable-connection-worker-request';
import { DisposeConnectionWorkerRequest } from './redraw-connections/worker/dispose-connection-worker/dispose-connection-worker-request';
import { EnsureConnectionWorkerRequest } from './redraw-connections/worker/ensure-connection-worker/ensure-connection-worker-request';
import { HandleConnectionWorkerMessageRequest } from './redraw-connections/worker/handle-connection-worker-message/handle-connection-worker-message-request';
import { IsConnectionRedrawCurrentRequest } from './redraw-connections/pipeline/is-connection-redraw-current/is-connection-redraw-current-request';
import { IsConnectionWorkerEnabledRequest } from './redraw-connections/worker/is-connection-worker-enabled/is-connection-worker-enabled-request';
import { MarkConnectionConnectorsAsConnectedRequest } from './redraw-connections/main-thread/mark-connection-connectors-as-connected/mark-connection-connectors-as-connected-request';
import { RedrawConnectionsRequest } from './redraw-connections/redraw-connections-request';
import { RemoveConnectionForCreateFromStoreRequest } from './remove-connection-for-create-from-store/remove-connection-for-create-from-store-request';
import { RemoveConnectionFromStoreRequest } from './remove-connection-from-store/remove-connection-from-store-request';
import { RemoveConnectionMarkerFromStoreRequest } from './remove-connection-marker-from-store/remove-connection-marker-from-store-request';
import { RemoveConnectionWaypointRequest } from './remove-connection-waypoint/remove-connection-waypoint-request';
import { RemoveSnapConnectionFromStoreRequest } from './remove-snap-connection-from-store/remove-snap-connection-from-store-request';
import { RenderConnectionFromGeometryRequest } from './redraw-connections/main-thread/render-connection-from-geometry/render-connection-from-geometry-request';
import { RenderConnectionRequest } from './redraw-connections/main-thread/render-connection/render-connection-request';
import { RenderConnectionWithLineRequest } from './redraw-connections/main-thread/render-connection-with-line/render-connection-with-line-request';
import { ResetConnectionWorkerRuntimeRequest } from './redraw-connections/worker/reset-connection-worker-runtime/reset-connection-worker-runtime-request';
import { ResolveConnectionEndpointRectRequest } from './redraw-connections/shared/resolve-connection-endpoint-rect/resolve-connection-endpoint-rect-request';
import { ResolveConnectionEndpointRotationContextRequest } from './resolve-connection-endpoint-rotation-context/resolve-connection-endpoint-rotation-context-request';
import { ResolveConnectionEndpointsRequest } from './redraw-connections/shared/resolve-connection-endpoints/resolve-connection-endpoints-request';
import { ResolveConnectionGeometryRequest } from './redraw-connections/shared/resolve-connection-geometry/resolve-connection-geometry-request';
import { RunConnectionRedrawSliceRequest } from './redraw-connections/pipeline/run-connection-redraw-slice/run-connection-redraw-slice-request';
import { RunConnectionWorkerBatchRequest } from './redraw-connections/worker/run-connection-worker-batch/run-connection-worker-batch-request';
import { RunConnectionWorkerRequest } from './redraw-connections/worker/run-connection-worker/run-connection-worker-request';
import { ShouldUseConnectionWorkerRequest } from './redraw-connections/worker/should-use-connection-worker/should-use-connection-worker-request';
import { StartConnectionRedrawRequest } from './redraw-connections/pipeline/start-connection-redraw/start-connection-redraw-request';
import { StartConnectionWorkerRedrawRequest } from './redraw-connections/worker/start-connection-worker-redraw/start-connection-worker-redraw-request';

/**
 * This file exports all the connection-related features for the F-Flow domain.
 */
export const F_CONNECTION_FEATURES = [
  ConnectionRedrawState,
  ConnectionWorkerState,

  fExecution(AddConnectionForCreateToStoreRequest, AddConnectionForCreateToStore),
  fExecution(AddConnectionMarkerToStoreRequest, AddConnectionMarkerToStore),
  fExecution(AddConnectionToStoreRequest, AddConnectionToStore),
  fExecution(AddSnapConnectionToStoreRequest, AddSnapConnectionToStore),

  fExecution(CreateConnectionMarkersRequest, CreateConnectionMarkers),

  fExecution(ApplyConnectionWorkerResultRequest, ApplyConnectionWorkerResult),
  fExecution(ApplyConnectionRenderRequest, ApplyConnectionRender),
  fExecution(BuildConnectionLineRequest, BuildConnectionLine),
  fExecution(BuildConnectionWorkerBatchRequest, BuildConnectionWorkerBatch),
  fExecution(BuildConnectionWorkerPayloadItemRequest, BuildConnectionWorkerPayloadItem),
  fExecution(CompleteConnectionRedrawRequest, CompleteConnectionRedraw),
  fExecution(DisableConnectionWorkerRequest, DisableConnectionWorker),
  fExecution(DisposeConnectionWorkerRequest, DisposeConnectionWorker),
  fExecution(EnsureConnectionWorkerRequest, EnsureConnectionWorker),
  fExecution(HandleConnectionWorkerMessageRequest, HandleConnectionWorkerMessage),
  fExecution(IsConnectionRedrawCurrentRequest, IsConnectionRedrawCurrent),
  fExecution(IsConnectionWorkerEnabledRequest, IsConnectionWorkerEnabled),
  fExecution(MarkConnectionConnectorsAsConnectedRequest, MarkConnectionConnectorsAsConnected),
  fExecution(RedrawConnectionsRequest, RedrawConnections),
  fExecution(RenderConnectionRequest, RenderConnection),
  fExecution(RenderConnectionFromGeometryRequest, RenderConnectionFromGeometry),
  fExecution(RenderConnectionWithLineRequest, RenderConnectionWithLine),
  fExecution(ResolveConnectionEndpointRectRequest, ResolveConnectionEndpointRect),
  fExecution(
    ResolveConnectionEndpointRotationContextRequest,
    ResolveConnectionEndpointRotationContext,
  ),
  fExecution(ResolveConnectionEndpointsRequest, ResolveConnectionEndpoints),
  fExecution(ResolveConnectionGeometryRequest, ResolveConnectionGeometry),
  fExecution(ResetConnectionWorkerRuntimeRequest, ResetConnectionWorkerRuntime),
  fExecution(RunConnectionRedrawSliceRequest, RunConnectionRedrawSlice),
  fExecution(RunConnectionWorkerRequest, RunConnectionWorker),
  fExecution(RunConnectionWorkerBatchRequest, RunConnectionWorkerBatch),
  fExecution(ShouldUseConnectionWorkerRequest, ShouldUseConnectionWorker),
  fExecution(StartConnectionRedrawRequest, StartConnectionRedraw),
  fExecution(StartConnectionWorkerRedrawRequest, StartConnectionWorkerRedraw),

  fExecution(RemoveConnectionForCreateFromStoreRequest, RemoveConnectionForCreateFromStore),
  fExecution(RemoveConnectionFromStoreRequest, RemoveConnectionFromStore),
  fExecution(RemoveConnectionMarkerFromStoreRequest, RemoveConnectionMarkerFromStore),
  fExecution(RemoveSnapConnectionFromStoreRequest, RemoveSnapConnectionFromStore),
  fExecution(RemoveConnectionWaypointRequest, RemoveConnectionWaypoint),
];
