import { NotifyDataChanged } from './features/notify-data-changed';
import { ListenDataChanges } from './features/listen-components-data-changed';
import { FComponentsStore } from './f-components-store';
import { ListenCountChanges } from './features/listen-count-changes';
import { ListenTransformChanges } from './features/listen-transform-changes';
import { NotifyTransformChanged } from './features/notify-transform-changed';

export const F_STORAGE_PROVIDERS = [
  NotifyDataChanged,

  ListenCountChanges,

  ListenDataChanges,

  ListenTransformChanges,

  NotifyTransformChanged,

  FComponentsStore,
];
