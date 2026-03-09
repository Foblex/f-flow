import { FConnectionWorker } from './model';
import {
  CalculateConnectionWorkerConnectorRect,
  CalculateConnectionWorkerPayloadItem,
  CalculateConnectionsUsingConnectionWorker,
  ConnectionWorkerRun,
  DisableConnectionWorker,
  EnsureConnectionWorker,
  HandleConnectionWorkerMessage,
  IsConnectionWorkerEnabled,
  ResetConnectionWorkerRuntime,
  ResolveConnectionWorkerConnectors,
  ResolveConnectionWorkerContext,
  ShouldUseConnectionWorker,
} from './features';

export const F_CONNECTION_WORKER_FEATURES = [
  FConnectionWorker,

  IsConnectionWorkerEnabled,
  HandleConnectionWorkerMessage,
  EnsureConnectionWorker,
  ConnectionWorkerRun,
  ResolveConnectionWorkerConnectors,
  ResolveConnectionWorkerContext,
  CalculateConnectionWorkerConnectorRect,
  CalculateConnectionWorkerPayloadItem,
  CalculateConnectionsUsingConnectionWorker,
  ShouldUseConnectionWorker,
  ResetConnectionWorkerRuntime,
  DisableConnectionWorker,
];
