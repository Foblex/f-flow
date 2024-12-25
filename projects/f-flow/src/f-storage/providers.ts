import { ComponentDataChangedExecution } from './features/component-data-changed';
import { ListenComponentsDataChangesExecution } from './features/listen-components-data-changed';
import { FComponentsStore } from './f-components-store';
import { ListenComponentsCountChangesExecution } from './features/listen-components-count-changes';
import { ListenTransformChangesExecution } from './features/listen-transform-changes';
import { TransformChangedExecution } from './features/transform-changed';

export const F_STORAGE_PROVIDERS = [

  ComponentDataChangedExecution,

  ListenComponentsCountChangesExecution,

  ListenComponentsDataChangesExecution,

  ListenTransformChangesExecution,

  TransformChangedExecution,

  FComponentsStore,
];
