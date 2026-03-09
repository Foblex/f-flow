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

export const F_STORAGE_PROVIDERS = [
  FComponentsStore,

  ListenNodesChanges,
  ListenConnectionsChanges,
  ListenTransformChanges,
  EmitConnectionsChanges,
  NotifyTransformChanged,

  RegisterPluginInstance,
  RemovePluginInstance,
];
