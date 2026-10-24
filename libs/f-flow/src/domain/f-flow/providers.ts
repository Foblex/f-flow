import { AddFlowToStore } from './add-flow-to-store';
import { RemoveFlowFromStore } from './remove-flow-from-store';
import { RunDevDiagnostics } from './run-dev-diagnostics';
import { GetFlow } from './get-flow';
import { GET_FLOW_STATE_PROVIDERS } from './calculate-flow-state';
import { fExecution } from '../../_libs/f-mediator';
import { AddFlowToStoreRequest } from './add-flow-to-store/add-flow-to-store-request';
import { GetFlowRequest } from './get-flow/get-flow-request';
import { NotifyFullRenderedRequest } from './render-lifecycle/notify-full-rendered/notify-full-rendered-request';
import { NotifyNodesRenderedRequest } from './render-lifecycle/notify-nodes-rendered/notify-nodes-rendered-request';
import { QueueConnectionRedrawRequest } from './render-lifecycle/queue-connection-redraw/queue-connection-redraw-request';
import { RemoveFlowFromStoreRequest } from './remove-flow-from-store/remove-flow-from-store-request';
import { ResetRenderLifecycleRequest } from './render-lifecycle/reset-render-lifecycle/reset-render-lifecycle-request';
import { RunDevDiagnosticsRequest } from './run-dev-diagnostics/run-dev-diagnostics-request';
import { WaitForConnectionsRenderedRequest } from './render-lifecycle/wait-for-connections-rendered/wait-for-connections-rendered-request';
import {
  RenderLifecycleState,
  NotifyNodesRendered,
  NotifyFullRendered,
  WaitForConnectionsRendered,
  ResetRenderLifecycle,
  QueueConnectionRedrawState,
  QueueConnectionRedraw,
} from './render-lifecycle';

/**
 * Providers for managing the Flow in the FComponentsStore.
 * This includes adding, retrieving, and removing the Flow,
 * as well as getting the Flow host element and its state.
 */
export const F_FLOW_FEATURES = [
  fExecution(AddFlowToStoreRequest, AddFlowToStore),

  fExecution(GetFlowRequest, GetFlow),

  ...GET_FLOW_STATE_PROVIDERS,

  fExecution(RemoveFlowFromStoreRequest, RemoveFlowFromStore),

  fExecution(RunDevDiagnosticsRequest, RunDevDiagnostics),

  RenderLifecycleState,
  fExecution(NotifyNodesRenderedRequest, NotifyNodesRendered),
  fExecution(NotifyFullRenderedRequest, NotifyFullRendered),
  fExecution(WaitForConnectionsRenderedRequest, WaitForConnectionsRendered),
  fExecution(ResetRenderLifecycleRequest, ResetRenderLifecycle),

  QueueConnectionRedrawState,
  fExecution(QueueConnectionRedrawRequest, QueueConnectionRedraw),
];
