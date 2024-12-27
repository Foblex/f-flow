import { ComponentDataChangedExecution } from './features/component-data-changed';
import { ListenComponentsDataChangesExecution } from './features/listen-components-data-changed';
import { FComponentsStore } from './f-components-store';
import { UpdateLayersWhenComponentsChangedExecution } from './features/update-layers-when-components-changed';
import { ListenTransformChangesExecution } from './features/listen-transform-changes';
import { NotifyTransformChangedExecution } from './features/notify-transform-changed';

export const F_STORAGE_PROVIDERS = [

  ComponentDataChangedExecution,

  UpdateLayersWhenComponentsChangedExecution,

  ListenComponentsDataChangesExecution,

  ListenTransformChangesExecution,

  NotifyTransformChangedExecution,

  FComponentsStore,
];
