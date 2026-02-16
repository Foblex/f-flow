import {
  ListenCountChanges,
  ListenDataChanges,
  ListenTransformChanges,
  NotifyDataChanged,
  NotifyTransformChanged,
  RegisterPluginInstance,
} from './features';
import { FComponentsStore } from './f-components-store';
import { RemovePluginInstance } from './features/remove-plugin-instance';

export const F_STORAGE_PROVIDERS = [
  FComponentsStore,

  ListenCountChanges,
  ListenDataChanges,
  ListenTransformChanges,
  NotifyDataChanged,
  NotifyTransformChanged,

  RegisterPluginInstance,
  RemovePluginInstance,
];
