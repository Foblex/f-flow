import {
  ListenNodesChanges,
  ListenConnectionsChanges,
  ListenTransformChanges,
  EmitConnectionsChanges,
  NotifyTransformChanged,
  RegisterPluginInstance,
} from './features';
import { FComponentsStore } from './f-components-store';
import { RemovePluginInstance } from './features';
import { fExecution } from '../_libs/f-mediator';
import { EmitConnectionsChangesRequest } from './features/emit-connections-changes/emit-connections-changes-request';
import { ListenConnectionsChangesRequest } from './features/listen-connections-changes/listen-connections-changes-request';
import { ListenNodesChangesRequest } from './features/listen-nodes-changes/listen-nodes-changes-request';
import { ListenTransformChangesRequest } from './features/listen-transform-changes/listen-transform-changes-request';
import { NotifyTransformChangedRequest } from './features/notify-transform-changed/notify-transform-changed-request';
import { RegisterPluginInstanceRequest } from './features/register-plugin-instance/register-plugin-instance-request';
import { RemovePluginInstanceRequest } from './features/remove-plugin-instance/remove-plugin-instance-request';

export const F_STORAGE_PROVIDERS = [
  FComponentsStore,

  fExecution(ListenNodesChangesRequest, ListenNodesChanges),
  fExecution(ListenConnectionsChangesRequest, ListenConnectionsChanges),
  fExecution(ListenTransformChangesRequest, ListenTransformChanges),
  fExecution(EmitConnectionsChangesRequest, EmitConnectionsChanges),
  fExecution(NotifyTransformChangedRequest, NotifyTransformChanged),

  fExecution(RegisterPluginInstanceRequest, RegisterPluginInstance),
  fExecution(RemovePluginInstanceRequest, RemovePluginInstance),
];
