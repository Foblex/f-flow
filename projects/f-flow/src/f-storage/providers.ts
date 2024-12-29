import { NotifyDataChangedExecution } from './features/notify-data-changed';
import { ListenDataChangesExecution } from './features/listen-components-data-changed';
import { FComponentsStore } from './f-components-store';
import { ListenCountChangesExecution } from './features/listen-count-changes';
import { ListenTransformChangesExecution } from './features/listen-transform-changes';
import { NotifyTransformChangedExecution } from './features/notify-transform-changed';

export const F_STORAGE_PROVIDERS = [

  NotifyDataChangedExecution,

  ListenCountChangesExecution,

  ListenDataChangesExecution,

  ListenTransformChangesExecution,

  NotifyTransformChangedExecution,

  FComponentsStore,
];
